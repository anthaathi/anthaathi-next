import { useOrganizationContext } from '@/hooks/use-organization-id';
import { ContentWrapper, DataTableV2 } from '@anthaathi/components';
import { useIntl } from 'react-intl';
import { graphql, useLazyLoadQuery, usePaginationFragment } from 'react-relay';
import { UserListQuery } from '../../../__generated__/UserListQuery.graphql';
import { UserList_users$key } from '../../../__generated__/UserList_users.graphql';
import { User } from '@carbon/icons-react';
import { useNavigate } from 'react-router-dom';

export default function UserList() {
  const intl = useIntl();
  const org = useOrganizationContext();

  const data = useLazyLoadQuery<UserListQuery>(
    graphql`
      query UserListQuery {
        ...UserList_users
      }
    `,
    {}
  );

  const userList = usePaginationFragment(
    graphql`
      fragment UserList_users on Query
      @refetchable(queryName: "UserListPaginatedQuery")
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 10 }
        after: { type: "String" }
      ) {
        users(first: $count, after: $after)
          @connection(key: "UserList_users_users") {
          edges {
            node {
              id
              user {
                id
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
    data as UserList_users$key
  );

  const navigate = useNavigate();

  return (
    <ContentWrapper
      title={intl.formatMessage({ defaultMessage: 'Users' })}
      breadcrumb={[
        {
          title: org?.organizationByKey?.name,
        },
      ]}
      toolbarTab={[
        {
          title: intl.formatMessage({ defaultMessage: 'Overview' }),
        },
      ]}
    >
      <DataTableV2
        defaultIcon={<User />}
        onClick={(data) => {
          navigate(
            `/o/${org?.organizationByKey?.key}/user/${data.id.split('/')[4]}`
          );
        }}
        data={
          userList.data?.users.edges.map((res) => ({
            id: res?.node.user.id ?? '',
            title: `${res?.node.user.firstName} ${res?.node.user.lastName}`,
          })) ?? []
        }
        pagination={{
          type: 'load-more',
          hasNext: userList.hasNext,
          isLoadingNext: userList.isLoadingNext,
          onLoadMore: () => {
            userList.loadNext(10);
          },
        }}
      />
    </ContentWrapper>
  );
}
