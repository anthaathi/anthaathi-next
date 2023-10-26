import { Identity } from '@ory/client';
import { GraphQLError } from 'graphql';
import { builder } from '..';
import { identity } from '../../utils/ory-client';
import { openSearchClient } from '../../utils/opensearch';
import { prisma } from '../../db';
import { Prisma } from '../../generated/client';
import RecentOrganizationWhereInput = Prisma.RecentOrganizationWhereInput;
import { CustomerNode } from '../customer';

// TODO: Redis cache impl
const userInfoCache: Record<string, Promise<UserInfo>> = {};

export class UserInfo {
  get id(): string {
    return this.data.id;
  }

  get firstName(): string {
    return this.data.traits.firstName;
  }

  get lastName(): string {
    return this.data.traits.lastName;
  }

  static async fromId(id: string) {
    // eslint-disable-next-line
    // @ts-ignore
    if (userInfoCache[id]) {
      return userInfoCache[id];
    }

    userInfoCache[id] = identity
      .getIdentity({
        id: id,
      })
      .then((docs) => {
        return new UserInfo(docs.data);
      })
      .catch((e) => {
        if (e.response?.data?.error?.code === 404) {
          throw new GraphQLError('User not found', {
            extensions: {
              code: 'USER_NOT_FOUND',
            },
          });
        }

        throw e;
      });

    return userInfoCache[id];
  }

  get emails() {
    return (
      this.data.verifiable_addresses?.map((res) => ({
        email: res.value,
        verified: res.verified,
      })) ?? []
    );
  }

  static async createNewUser(
    firstName: string,
    lastName: string,
    email: string,
  ) {
    return identity
      .createIdentity({
        createIdentityBody: {
          schema_id: 'default',
          traits: {
            firstName,
            lastName,
            email,
          },
        },
      })
      .then((docs) => new UserInfo(docs.data))
      .catch((e) => {
        if (e.response?.data?.error?.code === 409) {
          throw new GraphQLError('User already exists', {
            extensions: {
              code: 'USER_ALREADY_EXISTS',
            },
          });
        }

        throw e;
      });
  }

  public constructor(private data: Identity) {}

  static fromEmail(email: string) {
    return identity
      .listIdentities({
        credentialsIdentifier: email,
      })
      .then((docs) => {
        const result = docs.data.find(
          (res) =>
            res.verifiable_addresses?.findIndex((e) => e.value === email) !==
            -1,
        );

        if (!result) {
          throw new GraphQLError('User not found', {
            extensions: {
              code: 'USER_NOT_FOUND',
            },
          });
        }

        return new UserInfo(result);
      });
  }
}

const userEmailType = builder.simpleObject('UserEmail', {
  fields: (t) => ({
    email: t.string({
      nullable: false,
    }),
    verified: t.boolean({
      nullable: false,
    }),
  }),
});

const userInfo = builder.node(UserInfo, {
  id: {
    resolve: (num) => num.id,
  },
  loadOne: async (id) => {
    return UserInfo.fromId(id);
  },
  loadMany: async (ids) => {
    return ids.map((id) => UserInfo.fromId(id));
  },
  name: 'UserCore',
  fields: (t) => ({
    firstName: t.exposeString('firstName', { nullable: true }),
    lastName: t.exposeString('lastName', { nullable: true }),
    email: t.field({
      type: [userEmailType],
      nullable: false,
      resolve: (user) => {
        return user.emails;
      },
    }),
  }),
  isTypeOf: (co) => {
    return (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      typeof (co as Record<string, any>)['access'] === 'object' ||
      co instanceof UserInfo
    );
  },
});

builder.prismaNode('RecentOrganization', {
  name: 'OrganizationUser',
  id: { field: 'id' },
  fields: (t) => ({
    user: t.field({
      type: UserInfo,
      resolve: async (root, args, ctx) => {
        return UserInfo.fromId(root.userId);
      },
    }),
  }),
});

builder.queryField('users', (t) =>
  t.prismaConnection({
    cursor: 'id',
    type: 'RecentOrganization',
    args: {
      org: t.arg.string({}),
      group: t.arg.globalID({}),
    },
    resolve: (parent, args, inputs) => {
      const firstCondition: RecentOrganizationWhereInput | undefined =
        inputs.org
          ? {
              organization: {
                key: inputs.org,
              },
            }
          : undefined;

      const secondCondition: RecentOrganizationWhereInput | undefined = inputs
        .group?.id
        ? {
            organization: {
              group: {
                some: {
                  id: +inputs.group.id,
                },
              },
            },
          }
        : undefined;

      console.log(JSON.stringify(secondCondition, null, 2));

      return prisma.recentOrganization.findMany({
        ...parent,
        where: {
          AND: [firstCondition, secondCondition].filter(
            Boolean,
          ) as RecentOrganizationWhereInput[],
        },
      });
    },
  }),
);

builder.relayMutationField(
  'inviteUser',
  {
    inputFields: (t) => ({
      organization: t.globalID({}),
      orgKey: t.string(),
      emails: t.stringList({
        required: true,
      }),
      role: t.field({
        type: 'OrganizationRole' as never,
        required: true,
      }),
    }),
  },
  {
    resolve: async (query, args) => {
      return {
        success: true,
      };
    },
  },
  {
    outputFields: (t) => ({
      success: t.exposeBoolean('success'),
    }),
  },
);

builder.queryField('searchUser', (t) =>
  t.connection({
    type: UserInfo,
    args: {
      query: t.arg.string({
        required: true,
      }),
      organizationId: t.arg.globalID({
        required: true,
      }),
    },
    resolve: async (
      parent,
      { first, last, before, after, query, organizationId },
    ) => {
      const result = await openSearchClient.search({
        index: 'org-' + organizationId.id,
        size: first ?? 10,
        from: after ? +Buffer.from(after, 'base64').toString('ascii') : 0,
        body: {
          query: {
            query_string: {
              query: query,
              minimum_should_match: 2,
              fields: ['traits.email', 'traits.firstName', 'traits.lastName'],
            },
          },
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const searchResult = result.body.hits.hits.map((hit_: any) => {
        const hit = hit_['_source'] as Identity;
        return {
          cursor: Buffer.from(hit.id.toString()).toString('base64'),
          node: new UserInfo(hit),
        };
      });

      return {
        edges: searchResult,
        pageInfo: {
          hasNextPage: result.body.hits.total.value > searchResult.length,
          hasPreviousPage: !!before,
          startCursor: searchResult?.[0]?.cursor,
          endCursor: searchResult?.[searchResult.length - 1]?.cursor,
        },
      };
    },
  }),
);
