import { graphql, usePaginationFragment } from 'react-relay';
import { OrganizationCardContainer$key } from '../../../../../__generated__/OrganizationCardContainer.graphql';
import React, { useCallback } from 'react';
import { DataTableV2 } from '@anthaathi/components';
import { Building } from '@carbon/icons-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export interface OrganizationCardContainerProps {
  $key: OrganizationCardContainer$key;
}

export function OrganizationCardContainer(
  props: OrganizationCardContainerProps,
) {
  const { data, hasNext, loadNext, isLoadingNext } = usePaginationFragment(
    graphql`
      fragment OrganizationCardContainer on Query
      @refetchable(queryName: "OrganizationListContainerQuery")
      @argumentDefinitions(
        first: { type: "Int", defaultValue: 20 }
        last: { type: "Int" }
        after: { type: "String" }
        before: { type: "String" }
      ) {
        organizations(
          first: $first
          last: $last
          after: $after
          before: $before
        ) @connection(key: "list_organizations") {
          edges {
            node {
              id
              key
              name
              ...OrganizationCard_index
            }
          }
        }
      }
    `,
    props.$key,
  );

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const redirect = searchParams.get('redirect-url');

  const onClick = useCallback(
    (item: { title: string; id: string; key: string | undefined }) => {
      const navigateToDefault = () => {
        navigate('/o/' + item.key);
      };

      if (!redirect) {
        navigateToDefault();
        return;
      }

      const url = new URL(redirect);

      // eslint-disable-next-line no-restricted-globals
      const [, ...currentURL] = location.hostname.split('.');
      const [, ...targetURL] = url.hostname.split('.');
      if (currentURL.length !== targetURL.length) {
        navigateToDefault();
        return;
      }

      const shouldRender = currentURL.every(
        (url, index) => url === targetURL[index],
      );
      if (!shouldRender) {
        navigateToDefault();
        return;
      }

      if (url.pathname.startsWith('/o/')) {
        const array = url.pathname.split('/');
        array[2] = item.key!;
        url.pathname = array.join('/');

        window.location.href = url.toString();
      } else {
        window.location.href = redirect + 'o/' + item.key;
      }
    },
    [navigate, redirect],
  );

  return (
    <DataTableV2
      onClick={onClick}
      pagination={{
        hasNext,
        isLoadingNext: isLoadingNext,
        type: 'load-more',
        onLoadMore: () => {
          loadNext(10);
        },
      }}
      defaultIcon={<Building />}
      data={data.organizations.edges.map((res) => ({
        title: res?.node?.name!,
        id: res?.node?.id!,
        key: res?.node?.key,
      }))}
    />
  );
}
