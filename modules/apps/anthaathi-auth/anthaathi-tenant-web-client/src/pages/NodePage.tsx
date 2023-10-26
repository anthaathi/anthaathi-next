import { useLoaderData } from 'react-router-dom';
import { PreloadedQuery, usePreloadedQuery } from 'react-relay';
import { NodePageQuery } from '@/App';
import {
  App_NodePageQuery,
  App_NodePageQuery$data,
} from '../../__generated__/App_NodePageQuery.graphql';
import { GroupInfo } from '@/features/Groups/containers/GroupInfo';
import React from 'react';
import { ContentWrapper } from '@anthaathi/components';
import { FormattedMessage, useIntl } from 'react-intl';
import { Block } from 'baseui/block';

const mapping: Record<
  string,
  React.FunctionComponent<{ $key: NonNullable<App_NodePageQuery$data> }>
> = {
  Group: GroupInfo,
};

export function NodePage() {
  const _data = useLoaderData() as PreloadedQuery<App_NodePageQuery>;
  const query = usePreloadedQuery(NodePageQuery, _data, {});
  const Component = mapping[query.node?.__typename!];
  const intl = useIntl();

  if (!query.node) {
    return null;
  }

  return (
    <ContentWrapper
      title={query.node.title}
      center
      maxWidth="1400px"
      breadcrumb={[
        {
          title: intl.formatMessage({ defaultMessage: 'Anthaathi Admin' }),
        },
      ]}
      toolbarTab={[
        {
          title: <FormattedMessage defaultMessage="Overview" />,
        },
      ]}
    >
      <Block maxWidth="1400px" margin="0 auto">
        <Component $key={query} />
      </Block>
    </ContentWrapper>
  );
}
