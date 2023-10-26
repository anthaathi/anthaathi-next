import { prisma } from '../../db';
import { builder } from '../index';
import './group';
import { GraphQLError } from 'graphql';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export const organization = builder.prismaNode('Organization', {
  id: { field: 'id' },
  fields: (t) => ({
    iid: t.exposeString('id', { nullable: false }),
    name: t.exposeString('name', { nullable: false }),
    description: t.exposeString('description', { nullable: true }),
    key: t.exposeString('key'),
    data: t.expose('data', {
      type: 'Json',
    }),
    createdAt: t.expose('createdAt', {
      type: 'Date',
    }),
    updatedAt: t.expose('updatedAt', {
      type: 'Date',
    }),
  }),
  authScopes: {
    loggedIn: true,
  },
});

const organizationTemplate = builder.prismaNode('OrganizationTemplate', {
  id: { field: 'id' },
  fields: (t) => ({
    name: t.exposeString('name', { nullable: false }),
    description: t.exposeString('description', { nullable: true }),
    config: t.expose('config', {
      type: 'Json',
    }),
  }),
});

builder.queryField('organizationTemplates', (t) =>
  t.prismaConnection({
    type: 'OrganizationTemplate',
    cursor: 'id',
    resolve(query, parent, args, context, info) {
      return prisma.organizationTemplate.findMany({ ...query });
    },
  }),
);

builder.queryField('organizationTemplateById', (t) =>
  t.prismaField({
    type: 'OrganizationTemplate',
    args: {
      id: t.arg.globalID({
        required: false,
      }),
    },
    nullable: true,
    resolve: (query, parent, args, context, info) => {
      const id = args.id?.id;

      if (args.id && args.id.typename !== 'OrganizationTemplate') {
        throw new GraphQLError('Invalid organization template id');
      }

      if (!id) {
        return null;
      }

      return prisma.organizationTemplate.findUnique({
        where: {
          id: +id,
        },
      });
    },
  }),
);

builder.relayMutationField(
  'createOrganization',
  {
    inputFields: (t) => ({
      name: t.string({ required: true }),
      description: t.string({ required: false }),
      templateId: t.globalID({
        required: true,
        for: organizationTemplate,
      }),
      key: t.string({
        required: true,
      }),
      data: t.field({
        type: 'Json',
        required: true,
      }),
    }),
  },
  {
    authScopes: {
      loggedIn: true,
    },
    resolve: async (_, args, ctx) => {
      const result = await prisma
        .$transaction(async (tx) => {
          const org = await tx.organization.create({
            data: {
              name: args.input.name,
              description: args.input.description,
              data: args.input.data as object,
              key: args.input.key,
              templateId: +args.input.templateId.id,
            },
          });

          await tx.recentOrganization.create({
            data: {
              organizationId: org.id,
              userId: ctx.session.identity!.id,
            },
          });

          return org;
        })
        .catch((e) => {
          if (e.code === 'P2002') {
            // Unique constraint error
            throw new GraphQLError('Organization already exists');
          }
          throw e;
        });

      return { organization: result };
    },
  },
  {
    outputFields: (t) => ({
      result: t.expose('organization', {
        type: organization,
      }),
    }),
  },
);

builder.queryField('organizationByKey', (t) =>
  t.prismaField({
    type: 'Organization',
    nullable: true,
    args: {
      key: t.arg.string({
        required: true,
      }),
    },
    resolve: (query, parent, args, context, info) => {
      return prisma.organization.findFirst({
        where: {
          key: args.key,
          recentOrganization: {
            some: {
              userId: context.session.identity?.id,
            },
          },
        },
      });
    },
  }),
);

builder.queryField('organizations', (t) =>
  t.prismaConnection({
    type: 'Organization',
    cursor: 'id',
    authScopes: {
      loggedIn: true,
    },
    resolve(query, parent, args, context, info) {
      return prisma.organization.findMany({
        ...query,
        where: {
          recentOrganization: {
            some: {
              userId: {
                equals: context.session.identity?.id,
              },
            },
          },
        },
      });
    },
  }),
);
