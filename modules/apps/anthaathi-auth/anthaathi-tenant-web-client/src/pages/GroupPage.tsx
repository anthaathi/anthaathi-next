import React from 'react';
import { ContentWrapper } from '@anthaathi/components';
import { useIntl } from 'react-intl';
import { Block } from 'baseui/block';
import { GroupList } from '@/features/Groups/containers/GroupList';
import { useLoaderData } from 'react-router-dom';
import { PreloadedQuery, usePreloadedQuery } from 'react-relay';
import { GroupListQuery } from '@/App';
import { App_GroupListQuery } from '../../__generated__/App_GroupListQuery.graphql';
import { CreateGroup } from '@/features/Groups/containers/CreateGroup';

export function GroupPage() {
  const intl = useIntl();
  const _data = useLoaderData() as PreloadedQuery<App_GroupListQuery>;
  const query = usePreloadedQuery(GroupListQuery, _data, {});

  return (
    <>
      <ContentWrapper
        title={intl.formatMessage({ defaultMessage: 'Groups' })}
        breadcrumb={[
          {
            title: 'Anthaathi Admin',
          },
        ]}
        toolbarTab={[
          {
            title: 'All groups',
          },
        ]}
        toolbarActions={<CreateGroup />}
        center
        maxWidth="1400px"
      >
        <Block maxWidth="1400px" margin="0 auto">
          <GroupList $key={query} />
        </Block>
      </ContentWrapper>
    </>
  );
}
