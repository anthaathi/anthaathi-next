import { DataTableV2, useDateFormat } from '@anthaathi/components';
import { graphql, usePaginationFragment } from 'react-relay';
import { GroupList_list$key } from '../../../../../__generated__/GroupList_list.graphql';
import { Edit, Group } from '@carbon/icons-react';
import { StyledLink } from 'baseui/link';
import { Link, useParams } from 'react-router-dom';

export function GroupList(props: { $key: GroupList_list$key }) {
  const { hasNext, loadNext, isLoadingNext, data } = usePaginationFragment(
    graphql`
      fragment GroupList_list on Query
      @argumentDefinitions(
        orgKey: { type: "String!" }
        first: { type: "Int", defaultValue: 12 }
        last: { type: "Int" }
        after: { type: "String" }
        before: { type: "String" }
      )
      @refetchable(queryName: "GroupListQuery") {
        groups(
          orgKey: $orgKey
          first: $first
          last: $last
          after: $after
          before: $before
        ) @connection(key: "groupsList_groups") {
          edges {
            node {
              id
              iid
              name
              description
              createdAt
            }
          }
        }
      }
    `,
    props.$key,
  );

  const params = useParams<{ key: string }>();

  const format = useDateFormat();

  return (
    <DataTableV2
      pagination={{
        type: 'load-more',
        hasNext,
        isLoadingNext,
        onLoadMore: () => {
          loadNext(10);
        },
      }}
      schema={{
        type: 'object',
        properties: {
          edit: {
            type: 'string',
            title: 'Edit',
            format: 'url',
            align: 'center',
          },
          title: {
            type: 'string',
            title: 'Name',
          },
          createdAt: {
            type: 'string',
            format: 'date',
            title: 'Created at',
          },
        },
      }}
      initialState={{
        columnSizing: {
          edit: 12,
          createdAt: 120,
        },
      }}
      defaultIcon={<Group />}
      initialViewState="table"
      data={data.groups.edges.map((res) => ({
        title: res?.node?.name!,
        id: res?.node?.id!,
        createdAt: format(new Date(res?.node?.createdAt)),
        edit: (
          <StyledLink
            to={'/o/' + params.key + '/group/' + res?.node?.iid}
            $as={Link}
            $style={{
              display: 'flex',
              alignItems: 'center',
              placeContent: 'center',
            }}
          >
            <Edit />
          </StyledLink>
        ),
      }))}
    />
  );
}
