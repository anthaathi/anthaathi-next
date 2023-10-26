import { prisma } from '../../db';
import { builder } from '../index';

builder.prismaNode('Order', {
  name: 'EsgOrder',
  fields: (t) => ({}),
  id: { field: 'id' },
});

builder.queryField('esgOrders', (t) =>
  t.prismaConnection({
    cursor: 'id',
    type: 'Order',
    resolve: (query, parent, args, context, info) => {
      return prisma.order.findMany({
        ...query,
        where: {
          organization: {
            recentOrganization: {
              some: {
                userId: context.session.identity?.id,
              },
            },
          },
        },
      });
    },
  }),
);
