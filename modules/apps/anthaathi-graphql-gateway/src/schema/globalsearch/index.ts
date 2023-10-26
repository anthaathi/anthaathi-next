import { builder } from '../index';
import { openSearchClient } from '../../utils/opensearch';

class Globalsearch {
  constructor(
    public readonly id: string,
    public label: string,
    public entityId: string,
  ) {}
}

builder.node(Globalsearch, {
  name: 'GlobalSearch',
  id: {
    resolve: (globalsearch: Globalsearch) => globalsearch.id,
    parse: (value) => value,
  },
  fields: (t) => ({
    label: t.exposeString('label', {}),
    entityId: t.exposeString('entityId', {}),
  }),
  loadOne: () => {
    throw new Error('not implemented');
  },
});

builder.queryField('globalSearch', (t) => {
  return t.connection({
    type: Globalsearch,
    args: {
      query: t.arg.string({
        required: true,
      }),
      organizationId: t.arg.globalID({
        required: true,
      }),
    },
    resolve: async (ctx, { first, after, before, ...args }) => {
      const result = await openSearchClient.search({
        index: [
          `tasks_${args.organizationId.id}`,
          'org-' + args.organizationId.id,
        ],
        size: first ?? 10,
        from: after ? +Buffer.from(after, 'base64').toString('ascii') : 0,
        body: {
          query: {
            query_string: {
              query: args.query,
            },
          },
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const searchResult = result.body.hits.hits.map((hit_: any) => {
        const hit = hit_['_source'];

        let type: string;
        let displayName: string;

        switch (hit_._index) {
          case 'tasks_' + args.organizationId.id:
            type = 'Task';
            displayName = hit.title;
            break;
          case 'org-' + args.organizationId.id:
            type = 'UserCore';
            displayName =
              hit.name ??
              hit.traits.firstName +
                ' ' +
                hit.traits.lastName +
                ' (' +
                hit.traits.email +
                ')';
            break;
          default:
            throw new Error('not implemented');
        }

        return {
          cursor: Buffer.from(hit.id.toString()).toString('base64'),
          node: new Globalsearch(
            hit.id,
            displayName,
            'gid://Anthaathi/' + type + '/' + hit.id,
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
  });
});
