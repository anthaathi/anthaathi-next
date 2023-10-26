import { GraphQLError } from 'graphql';
import { prisma } from '../../db';
import { builder } from '../index';
import { openSearchClient } from '../../utils/opensearch';
import { organization } from '../organization';

export const Address = builder.prismaNode('Address', {
  id: { field: 'id' },
  fields: (t) => ({
    title: t.exposeString('title'),
    street: t.exposeString('street', { nullable: true }),
    city: t.exposeString('city', { nullable: true }),
    state: t.exposeString('state', { nullable: true }),
    country: t.exposeString('country', { nullable: true }),
    landmark: t.exposeString('landmark', { nullable: true }),
    technicalContact: t.exposeString('technicalContact', { nullable: true }),
    zipCode: t.exposeString('zipCode', {
      nullable: true,
    }),
  }),
});

export const CustomerTemplate = builder.prismaNode('CustomerTemplate', {
  id: { field: 'id' },
  fields: (t) => ({
    iid: t.exposeInt('id', { nullable: false }),
    name: t.exposeString('name', { nullable: false }),
    description: t.exposeString('description', { nullable: true }),
    config: t.expose('config', {
      type: 'Json',
    }),
    organization: t.relation('organization'),
  }),
});

export const CustomerNode = builder.prismaNode('Customer', {
  id: { field: 'id' },
  fields: (t) => ({
    iid: t.exposeInt('id', { nullable: false }),
    name: t.exposeString('name', { nullable: false }),
    firstName: t.exposeString('firstName', {
      nullable: true,
    }),
    lastName: t.exposeString('lastName', {
      nullable: true,
    }),
    email: t.exposeString('email', {
      nullable: true,
    }),
    phoneNumber: t.exposeString('phoneNumber', {
      nullable: true,
    }),
    data: t.expose('data', {
      type: 'Json',
      nullable: true,
    }),
    company: t.exposeString('company', {
      nullable: true,
    }),
    template: t.relation('template', {
      nullable: true,
    }),
    addresses: t.relatedConnection('addresses', {
      cursor: 'id',
    }),
  }),
});

export const updateCustomer = builder.relayMutationField(
  'updateCustomer',
  {
    inputFields: (t) => ({
      id: t.globalID({
        required: true,
      }),
      firstName: t.string({
        required: false,
      }),
      lastName: t.string({
        required: false,
      }),
      email: t.string({
        required: false,
      }),
      phoneNumber: t.string({
        required: false,
      }),
      company: t.string({
        required: false,
      }),
      data: t.field({
        type: 'Json',
        required: false,
      }),
    }),
  },
  {
    resolve: async (query, args) => {
      const customer = await prisma.customer.update({
        where: {
          id: +args.input.id.id,
        },
        data: {
          firstName: args.input.firstName ?? undefined,
          lastName: args.input.lastName ?? undefined,
          email: args.input.email ?? undefined,
          phoneNumber: args.input.phoneNumber ?? undefined,
          company: args.input.company ?? undefined,
          data: (args.input.data as never) ?? undefined,
        },
      });

      return { customer };
    },
  },
  {
    outputFields: (t) => ({
      customer: t.field({
        type: CustomerNode,
        nullable: false,
        resolve: (options, args, context, info) => {
          return options.customer;
        },
      }),
    }),
  },
);

builder.relayMutationField(
  'createCustomer',
  {
    inputFields: (t) => ({
      organization: t.globalID({
        required: true,
      }),
      name: t.string({
        required: true,
      }),
      customerGroup: t.globalID({}),
      firstName: t.string({}),
      lastName: t.string({}),
      email: t.string({}),
      phoneNumber: t.string({}),
      company: t.string({}),
      template: t.globalID({}),
      data: t.field({
        type: 'Json',
      }),
    }),
  },
  {
    resolve: async (query, args) => {
      const customer = await prisma.customer.create({
        data: {
          name: args.input.name,
          firstName: args.input.firstName ?? undefined,
          lastName: args.input.lastName ?? undefined,
          email: args.input.email ?? undefined,
          phoneNumber: args.input.phoneNumber ?? undefined,
          company: args.input.company ?? undefined,
          data: args.input.data as never,
          organization: {
            connect: {
              id: args.input.organization.id,
            },
          },
          ...(args.input.template
            ? {
                template: {
                  connect: {
                    id: +args.input.template.id,
                  },
                },
              }
            : {}),
        },
      });

      return { customer };
    },
  },
  {
    outputFields: (t) => ({
      customer: t.expose('customer', {
        type: CustomerNode,
        nullable: true,
      }),
    }),
  },
);

builder.queryField('customers', (t) =>
  t.prismaConnection({
    cursor: 'id',
    type: 'Customer',
    authScopes: {
      loggedIn: true,
    },
    args: {
      organization: t.arg.globalID({
        required: true,
      }),
      customerGroup: t.arg.globalID({
        required: false,
      }),
    },
    resolve(query, parent, args, context, info) {
      return prisma.customer.findMany({
        ...query,
        where: {
          organization: {
            id: args.organization.id,
          },
          ...(args.customerGroup
            ? {
                customerGroupAssociation: {
                  some: {
                    customerGroupId: +args.customerGroup.id!,
                  },
                },
              }
            : {}),
        },
      });
    },
  }),
);

export const CustomerGroupType = builder.enumType('CustomerGroupType', {
  values: ['Static', 'Dynamic'],
});

export const CustomerGroupAssociation = builder.prismaNode(
  'CustomerGroupAssociation',
  {
    id: { field: 'id' },
    fields: (t) => ({
      customer: t.field({
        type: CustomerNode,
        nullable: false,
        resolve: (options, args, context, info) => {
          return prisma.customer.findFirstOrThrow({
            where: {
              id: options.customerId,
            },
          });
        },
      }),
      group: t.field({
        type: CustomerGroup,
        nullable: false,
        resolve: (options, args, context, info) => {
          return prisma.customerGroup.findFirstOrThrow({
            where: {
              id: options.customerGroupId,
            },
          });
        },
      }),
    }),
  },
);

export const CustomerGroup = builder.prismaNode('CustomerGroup', {
  id: { field: 'id' },
  fields: (t) => ({
    name: t.exposeString('title', { nullable: false }),
    description: t.exposeString('description', { nullable: true }),
    iid: t.exposeInt('id', { nullable: false }),
    type: t.expose('type', {
      type: CustomerGroupType,
      nullable: false,
    }),
    condition: t.expose('condition', {
      type: 'Json',
      nullable: true,
    }),
    customers: t.prismaConnection({
      type: 'Customer',
      cursor: 'id',
      resolve(query, parent, args, context, info) {
        return prisma.customer.findMany({
          ...query,
          where: {
            customerGroupAssociation: {
              some: {
                customerGroupId: parent.id,
              },
            },
          },
        });
      },
    }),
  }),
});

builder.queryField('customerGroups', (t) =>
  t.prismaConnection({
    cursor: 'id',
    args: {
      organization: t.arg.globalID({
        required: true,
      }),
    },
    type: CustomerGroup,
    resolve(query, parent, args, context, info) {
      if (args.organization.typename !== 'Organization') {
        throw new GraphQLError('Invalid Organization ID');
      }

      return prisma.customerGroup.findMany({
        ...query,
        where: {
          organization: {
            id: args.organization.id,
          },
        },
      });
    },
  }),
);

export class SearchResult {
  constructor(
    public readonly id: string,
    public readonly label: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public readonly data: any,
  ) {}
}

builder.queryField('customerTemplates', (t) =>
  t.prismaConnection({
    cursor: 'id',
    type: 'CustomerTemplate',
    args: {
      organization: t.arg.globalID({
        required: true,
      }),
    },
    resolve(query, parent, args, context, info) {
      return prisma.customerTemplate.findMany({
        ...query,
        where: {
          organization: {
            id: args.organization.id,
          },
        },
      });
    },
  }),
);

builder.node(SearchResult, {
  id: {
    resolve: (result) => result.id,
  },
  // Define only one of the following methods for loading nodes by id
  loadOne: (id) => {
    throw new Error('Not implemented');
  },
  name: 'SearchResult',
  fields: (t) => ({
    label: t.exposeString('label', {}),
    data: t.expose('data', {
      type: 'Json',
    }),
    customerId: t.field({
      type: 'ID',
      resolve: (result) => `gid://Anthaathi/Customer/${result.id}`,
    }),
  }),
});

builder.queryField('searchCustomer', (t) =>
  t.connection({
    type: SearchResult,
    args: {
      query: t.arg.string({
        required: true,
      }),
      organizationId: t.arg.globalID({
        required: true,
      }),
    },
    resolve: async (parent, { first, last, before, after, query }) => {
      const result = await openSearchClient.search({
        index: 'customers',
        size: first ?? 10,
        from: after ? +Buffer.from(after, 'base64').toString('ascii') : 0,
        body: {
          query: {
            multi_match: {
              query: query,
              fields: [
                'name',
                'first_name',
                'last_name',
                'email',
                'phone_number',
                'data.FM_NAME_EN',
                'data.LASTNAME_EN',
                'data.EPIC_NO',
              ],
            },
          },
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const searchResult = result.body.hits.hits.map((hit_: any) => {
        const hit = hit_['_source'] as CustomerSearchRecord;
        return {
          cursor: Buffer.from(hit.id.toString()).toString('base64'),
          node: new SearchResult(
            hit.id.toString(),
            (hit.name ?? (hit.first_name ?? '') + ' ' + (hit.last_name ?? '')) +
              ' ' +
              (hit.email ?? '') +
              ' ' +
              (hit.phone_number ?? '') +
              ' ',
            hit.data,
          ),
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

export interface CustomerSearchRecord {
  organization_id: string;
  created_at: Date;
  email: string;
  phone_number: string;
  company: string;
  last_name: string;
  updated_at: Date;
  customer_template_id: number;
  id: number;
  name: string;
  first_name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  user_id: null;
}
