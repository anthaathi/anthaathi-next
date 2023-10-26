import { builder } from '..';
import { prisma } from '../../db';

const projectType = builder.enumType('ProjectType', {
  values: ['Task'],
});

const project = builder.prismaNode('Project', {
  authScopes: {
    loggedIn: true,
  },
  id: {
    field: 'id',
  },
  fields: (t) => ({
    name: t.exposeString('name', {
      nullable: false,
    }),
    description: t.exposeString('description', {
      nullable: true,
    }),
    data: t.expose('data', {
      type: 'Json',
    }),
    type: t.expose('type', {
      type: projectType,
    }),
  }),
});

builder.queryField('projects', (t) =>
  t.prismaConnection({
    type: project,
    cursor: 'id',
    args: {
      organization: t.arg.globalID({
        required: true,
      }),
    },
    resolve: (query, parent, args, context, info) => {
      return prisma.project.findMany({
        ...query,
        where: {
          organization: {
            id: args.organization.id,
          },
        },
      });
    },
  })
);
