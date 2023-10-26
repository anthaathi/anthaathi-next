import { DataTableV2 } from '@anthaathi/components';
import { graphql, usePaginationFragment } from 'react-relay';
import { UserList_container$key } from '../../../../../__generated__/UserList_container.graphql';
import { Edit, User } from '@carbon/icons-react';
import { Badge } from 'baseui/badge';
import { StyledLink } from 'baseui/link';
import { Link } from 'react-router-dom';

export interface UserListProps {
  $key: UserList_container$key;
}

export function UserList(props: UserListProps) {
  const { data, hasNext, isLoadingNext, loadNext } = usePaginationFragment(
    graphql`
      fragment UserList_container on Query
      @refetchable(queryName: "UserListQuery")
      @argumentDefinitions(
        org: { type: "String!" }
        first: { type: "Int", defaultValue: 50 }
        last: { type: "Int" }
        before: { type: "String" }
        after: { type: "String" }
        group: { type: "ID" }
      ) {
        users(
          first: $first
          last: $last
          before: $before
          after: $after
          org: $org
          group: $group
        ) @connection(key: "list_users") {
          edges {
            node {
              id
              user {
                firstName
                lastName
                email {
                  email
                  verified
                }
              }
            }
          }
        }
      }
    `,
    props.$key,
  );

  return (
    <>
      <DataTableV2
        pagination={{
          type: 'load-more',
          onLoadMore: () => {
            loadNext(10);
          },
          hasNext,
          isLoadingNext,
        }}
        schema={{
          type: 'object',
          properties: {
            view: {
              align: 'center',
              viewCellProps: {
                align: 'center',
                overrides: {
                  Cell: {
                    style: {
                      justifyContent: 'center',
                    },
                  },
                },
              },
              type: 'string',
              title: 'View',
              format: 'url',
            },
            firstName: {
              type: 'string',
              title: 'First name',
            },
            lastName: {
              type: 'string',
              title: 'Last name',
            },
            email: {
              type: 'string',
              title: 'Email',
            },
          },
        }}
        defaultIcon={<User />}
        data={data.users.edges.map((user) => {
          return {
            id: user?.node?.id!,
            view: (
              <StyledLink $as={Link} to="/">
                <Edit />
              </StyledLink>
            ),
            title: (
              (user?.node?.user.firstName ?? '') +
              ' ' +
              (user?.node?.user.lastName ?? '')
            ).trim(),
            ...(user?.node?.user ?? {}),
            email: user?.node?.user.email.map((res) => (
              <StyledLink href={`mailto:${res.email}`} key={res.email}>
                <Badge content={res.email} />
              </StyledLink>
            )),
          };
        })}
      />
    </>
  );
}
