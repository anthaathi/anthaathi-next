import {
  ContentWrapper,
  DefaultLayout,
  sidebarAtom,
} from '@anthaathi/components';
import { FormattedMessage, useIntl } from 'react-intl';
import { OrganizationCardContainer } from '@/features/Organization/containers/OrganizationCardContainer';
import { Link, useLoaderData } from 'react-router-dom';
import { App_HomePageQuery } from '../../__generated__/App_HomePageQuery.graphql';
import { PreloadedQuery, usePreloadedQuery } from 'react-relay';
import { HomePageQuery } from '@/App';
import React, { useEffect } from 'react';
import { Button } from 'baseui/button';
import { useRecoilState } from 'recoil';

export function HomePage() {
  const intl = useIntl();

  const _data = useLoaderData() as PreloadedQuery<App_HomePageQuery>;
  const query = usePreloadedQuery(HomePageQuery, _data, {});

  const [, setSidebarAtom] = useRecoilState(sidebarAtom);
  useEffect(() => {
    setSidebarAtom('close');
  }, [setSidebarAtom]);

  return (
    <DefaultLayout
      pageTitle={intl.formatMessage({ defaultMessage: 'Anthaathi Admin' })}
      items={[]}
      pageTitleTo="/"
    >
      <ContentWrapper
        toolbarActions={
          <Button size="compact" $as={Link} to="/manage/org/create">
            <FormattedMessage defaultMessage="Create new organization" />
          </Button>
        }
        breadcrumb={[
          {
            title: intl.formatMessage({ defaultMessage: 'Anthaathi Admin' }),
          },
        ]}
        title={intl.formatMessage({ defaultMessage: 'Organizations' })}
        toolbarTab={[
          {
            title: intl.formatMessage({ defaultMessage: 'Overview' }),
          },
        ]}
      >
        <OrganizationCardContainer $key={query} />
      </ContentWrapper>
    </DefaultLayout>
  );
}
