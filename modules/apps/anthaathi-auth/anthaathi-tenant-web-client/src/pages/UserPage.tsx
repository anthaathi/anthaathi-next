import { ContentWrapper } from '@anthaathi/components';
import { useIntl } from 'react-intl';
import { UserList } from '@/features/Users/containers/UserList';
import { useLoaderData } from 'react-router-dom';
import { PreloadedQuery, usePreloadedQuery } from 'react-relay';
import { UserListPageQuery } from '@/App';
import { App_UserListPageQuery } from '../../__generated__/App_UserListPageQuery.graphql';
import React from 'react';
import { Block } from 'baseui/block';
import { InviteUser } from '@/features/Users/containers/InviteUser';

export default function UserPage() {
  const intl = useIntl();
  const _data = useLoaderData() as PreloadedQuery<App_UserListPageQuery>;
  const query = usePreloadedQuery(UserListPageQuery, _data, {});

  return (
    <ContentWrapper
      title={intl.formatMessage({ defaultMessage: 'User' })}
      breadcrumb={[
        {
          title: 'Anthaathi Admin',
        },
      ]}
      toolbarTab={[
        {
          title: 'All users',
        },
      ]}
      toolbarActions={<InviteUser />}
      center
      maxWidth="1400px"
    >
      <Block maxWidth="1400px" margin="0 auto">
        <UserList $key={query} />
      </Block>
    </ContentWrapper>
  );
}
