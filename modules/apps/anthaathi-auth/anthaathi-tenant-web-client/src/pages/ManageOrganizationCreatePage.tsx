import React, { Suspense, useEffect } from 'react';
import { ContentWrapper, sidebarAtom } from '@anthaathi/components';
import { OrganizationCreate } from '@/features/Organization/containers/OrganizationTypeSelection';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { PreloadedQuery, usePreloadedQuery } from 'react-relay';
import type { App_OrganizationCreateQuery } from '../../__generated__/App_OrganizationCreateQuery.graphql';
import { OrganizationCreateQuery } from '@/App';
import { Block } from 'baseui/block';
import { useIntl } from 'react-intl';
import { Spinner } from 'baseui/spinner';
import { useRecoilState } from 'recoil';

export function ManageOrganizationCreatePage() {
  const _data = useLoaderData() as PreloadedQuery<App_OrganizationCreateQuery>;
  const query = usePreloadedQuery(OrganizationCreateQuery, _data, {});
  const router = useNavigate();

  const intl = useIntl();

  const [, setSidebarAtom] = useRecoilState(sidebarAtom);
  useEffect(() => {
    setSidebarAtom('close');
  }, [setSidebarAtom]);

  return (
    <ContentWrapper
      breadcrumb={[
        {
          title: intl.formatMessage({ defaultMessage: 'Anthaathi Admin' }),
          to: '/',
        },
      ]}
      toolbarTab={[
        {
          title: 'Form',
        },
      ]}
      maxWidth="800px"
      center
      title={intl.formatMessage({ defaultMessage: 'Create Organization' })}
    >
      <Block maxWidth="800px" margin="0 auto">
        <Suspense fallback={<Spinner />}>
          <OrganizationCreate
            $key={query}
            onNext={(orgId) => {
              router({
                pathname: `/o/${orgId}`,
                search: 'state=new',
              });
            }}
          />
        </Suspense>
      </Block>
    </ContentWrapper>
  );
}
