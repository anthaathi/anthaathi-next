import { graphql, usePaginationFragment } from 'react-relay';
import React, { useMemo } from 'react';
import { CustomerTable_customers$key } from '../../../../__generated__/CustomerTable_customers.graphql';
import { useIntl } from 'react-intl';
import { DataTableV2 } from '@anthaathi/components';
import { User } from '@carbon/icons-react';
import { useAppNavigate } from '@/hooks/use-app-navigate';

export function CustomerTable(props: {
  customers: CustomerTable_customers$key;
}) {
  const navigate = useAppNavigate();

  const { data: customers, ...rest } = usePaginationFragment(
    graphql`
      fragment CustomerTable_customers on Query
      @refetchable(queryName: "CustomerTablePaginationQuery")
      @argumentDefinitions(
        organizationId: { type: "ID!" }
        first: { type: "Int", defaultValue: 50 }
        after: { type: "String" }
        customerGroupId: { type: "ID" }
      ) {
        customers(
          organization: $organizationId
          customerGroup: $customerGroupId
          first: $first
          after: $after
        ) @connection(key: "CustomerTable_customers") {
          edges {
            node {
              id
              iid
              firstName
              lastName
              email
              phoneNumber
              addresses(first: 1) {
                edges {
                  node {
                    id
                    title
                    street
                    city
                    state
                    country
                  }
                }
              }
            }
          }
        }
      }
    `,
    props.customers
  );

  const customersData = useMemo(() => {
    return (
      customers.customers.edges
        .map((res) => res?.node)
        .map((res, index) => ({
          ...res,
          title: `${res?.firstName} ${res?.lastName}`.trim(),
          id: res?.id ?? index,
          addresses:
            res?.addresses.edges.map((res) => {
              const concatAddress = `${res?.node?.street}, ${res?.node?.city}, ${res?.node?.state}, ${res?.node?.country}`;

              return {
                label: (
                  <>
                    {res?.node?.title}: {concatAddress}
                    <br />
                  </>
                ),
                id: res?.node?.id,
              };
            }) ?? [],
        })) ?? []
    );
  }, [customers.customers.edges]);

  const intl = useIntl();

  return (
    <>
      <DataTableV2
        data={customersData ?? []}
        defaultIcon={<User />}
        pagination={{
          type: 'load-more',
          hasNext: rest.hasNext,
          isLoadingNext: rest.isLoadingNext,
          onLoadMore: () => rest.loadNext(10),
        }}
        initialViewState="table"
        onClick={(e) => {
          navigate('/customer/' + e.iid);
        }}
        actions={[
          {
            label: intl.formatMessage({ defaultMessage: 'View' }),
            key: 'view',
          },
        ]}
        onAction={(e, actions) => {
          if (e.length === 1 && actions === 'view') {
            navigate('/customer/' + e[0].iid);
          }
        }}
        schema={{
          type: 'object',
          properties: {
            firstName: {
              type: 'string',
              title: intl.formatMessage({ defaultMessage: 'First name' }),
            },
            lastName: {
              type: 'string',
              title: intl.formatMessage({ defaultMessage: 'Last name' }),
            },
            email: {
              type: 'string',
              format: 'email',
              title: intl.formatMessage({ defaultMessage: 'Email' }),
            },
            phoneNumber: {
              type: 'string',
              title: intl.formatMessage({ defaultMessage: 'Phone number' }),
            },
            addresses: {
              type: 'array',
              title: intl.formatMessage({ defaultMessage: 'Addresses' }),
              items: {
                type: 'object',
                properties: {
                  label: {
                    type: 'string',
                    title: intl.formatMessage({ defaultMessage: 'Title' }),
                  },
                  id: {
                    type: 'string',
                    title: intl.formatMessage({ defaultMessage: 'ID' }),
                  },
                },
              },
            },
          },
        }}
      />
    </>
  );
}
