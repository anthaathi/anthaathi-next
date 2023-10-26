import { GraphQLError } from 'graphql';
import { prisma } from '../../db';
import { UserInfo } from '../user';
import { builder } from '../index';

const Group = builder.prismaNode('Group', {
  id: { field: 'id' },
  fields: (t) => ({
    name: t.exposeString('name', { nullable: false }),
    description: t.exposeString('description', { nullable: true }),
    data: t.expose('data', {
      type: 'Json',
    }),
    iid: t.exposeInt('id'),
    createdAt: t.expose('createdAt', {
      type: 'DateTime',
    }),
    template: t.relation('template', {}),
    members: t.prismaConnection({
      type: 'GroupMembership',
      cursor: 'id',
      resolve(query, parent, args, context, info) {
        return prisma.groupMembership.findMany({
          ...query,
          where: { groupId: parent.id },
        });
      },
    }),
  }),
});

const GroupTemplate = builder.prismaNode('GroupTemplate', {
  id: { field: 'id' },
  fields: (t) => ({
    name: t.exposeString('name'),
    description: t.exposeString('description', {
      nullable: true,
    }),
    iid: t.exposeInt('id'),
    config: t.expose('config', {
      nullable: true,
      type: 'Json',
    }),
  }),
});

builder.queryField('groupTemplates', (t) =>
  t.prismaConnection({
    type: 'GroupTemplate',
    resolve: (query, parent, args, context, info) => {
      return prisma.groupTemplate.findMany({
        ...query,
        orderBy: {
          name: 'asc',
        },
      });
    },
    cursor: 'id',
  }),
);

const groupMembership = builder.prismaNode('GroupMembership', {
  id: { field: 'id' },
  fields: (t) => ({
    user: t.field({
      type: UserInfo,
      nullable: false,
      resolve: (options, args, context, info) => {
        return UserInfo.fromId(options.user);
      },
    }),
  }),
});

builder.queryField('groups', (t) =>
  t.prismaConnection({
    cursor: 'id',
    type: 'Group',
    authScopes: {
      loggedIn: true,
    },
    args: {
      organization: t.arg.globalID({}),
      orgKey: t.arg.string({}),
    },
    resolve(query, parent, args, context, info) {
      const id = args.organization?.id ?? undefined;
      const key = args.orgKey ?? undefined;

      if (!id && !key) {
        throw new GraphQLError('Ether key or id needs to be defined');
      }

      return prisma.group.findMany({
        ...query,
        orderBy: {
          createdAt: 'desc',
        },
        where: {
          organization: id
            ? {
                id,
              }
            : {
                key,
              },
        },
      });
    },
  }),
);

builder.relayMutationField(
  'createGroup',
  {
    inputFields: (t) => ({
      name: t.string({ required: true }),
      description: t.string({ required: false }),
      data: t.field({
        type: 'Json',
        required: true,
      }),
      organizationId: t.globalID({}),
      orgKey: t.string({}),
      groupTemplateId: t.globalID({
        required: true,
      }),
    }),
  },
  {
    resolve: async (parent, args, context, info) => {
      if (
        args.input.organizationId &&
        args.input.organizationId?.typename !== 'Organization'
      ) {
        throw new GraphQLError('Invalid organization ID');
      }

      if (!args.input.organizationId && !args.input.orgKey) {
        throw new GraphQLError('Needs atleast organizationId or orgKey');
      }

      if (args.input.groupTemplateId.typename !== 'GroupTemplate') {
        throw new GraphQLError('Invalid group template ID');
      }

      const group = await prisma.group.create({
        data: {
          name: args.input.name,
          description: args.input.description,
          data: args.input.data as never,
          template: {
            connect: {
              id: +(args.input.groupTemplateId.id as string),
            },
          },
          organization: {
            connect: args.input.organizationId?.id
              ? {
                  id: args.input.organizationId.id,
                }
              : {
                  key: args.input.orgKey!,
                },
          },
        },
      });

      return {
        group,
      };
    },
  },
  {
    outputFields: (t) => ({
      group: t.expose('group', {
        type: Group,
        nullable: true,
      }),
    }),
  },
);

builder.relayMutationField(
  'addUserToGroup',
  {
    inputFields(t) {
      return {
        groupId: t.globalID({
          required: true,
        }),
        userId: t.globalID({
          required: true,
        }),
      };
    },
  },
  {
    resolve: async (parent, args, context, info) => {
      if (args.input.groupId.typename !== 'Group') {
        throw new GraphQLError('Invalid group ID');
      }

      if (args.input.userId.typename !== 'UserCore') {
        throw new GraphQLError('Invalid user ID');
      }

      const user = await UserInfo.fromId(args.input.userId.id);

      const result = await prisma.groupMembership.create({
        data: {
          user: user.id,
          group: {
            connect: {
              id: +args.input.groupId.id,
            },
          },
        },
      });

      return {
        groupMembership: result,
      };
    },
  },
  {
    outputFields: (t) => ({
      groupMembership: t.field({
        type: groupMembership,
        nullable: true,
        resolve: (result) => {
          return result.groupMembership;
        },
      }),
    }),
  },
);

const organizationRole = builder.enumType('OrganizationRole', {
  values: ['ADMIN', 'VIEWER', 'EDITOR'],
});

builder.relayMutationField(
  'createUserAndAddToOrganization',
  {
    inputFields: (t) => ({
      firstName: t.string({ required: true }),
      lastName: t.string({ required: true }),
      email: t.string({ required: true }),
      organizationId: t.globalID({
        required: true,
      }),
      role: t.field({
        type: organizationRole,
        required: true,
      }),
    }),
  },
  {
    resolve: async (parent, args, context, info) => {
      if (args.input.organizationId.typename !== 'Organization') {
        throw new GraphQLError('Invalid organization ID');
      }

      const org = await prisma.recentOrganization.findFirst({
        where: {
          organizationId: args.input.organizationId.id,
          userId: context.session?.identity?.id,
        },
      });

      if (!org) {
        throw new GraphQLError('Invalid organization ID');
      }

      const result = await UserInfo.createNewUser(
        args.input.firstName,
        args.input.lastName,
        args.input.email,
      );

      await prisma.recentOrganization.create({
        data: {
          userId: result.id,
          organization: {
            connect: {
              id: args.input.organizationId.id,
            },
          },
        },
      });

      return {
        user: result,
      };
    },
  },
  {
    outputFields: (t) => ({
      user: t.field({
        type: UserInfo,
        nullable: true,
        resolve: (result) => {
          return result.user;
        },
      }),
    }),
  },
);
