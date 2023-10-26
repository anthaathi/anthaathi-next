import { fetchQuery, graphql, useRelayEnvironment } from 'react-relay';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useOrganizationContext } from '@/hooks/use-organization-id';
import { Option, Select } from 'baseui/select';
import { SearchCustomerQuery } from '../../../../__generated__/SearchCustomerQuery.graphql';

export interface SearchCustomerProps {
  onSelectCustomer: (customerId: string) => void;
}

export function SearchCustomer(props: SearchCustomerProps) {
  return (
    <>
      <SearchResult onSelectCustomer={props.onSelectCustomer} />
    </>
  );
}

function SearchResult(props: {
  onSelectCustomer: (customerId: string) => void;
}) {
  const org = useOrganizationContext();

  const env = useRelayEnvironment();

  const [searchString, setSearchString] = useState('');

  const [options, setOptions] = useState<Option>([]);

  useEffect(() => {
    fetchQuery<SearchCustomerQuery>(
      env,
      graphql`
        query SearchCustomerQuery($search: String!, $organizationId: ID!) {
          searchCustomer(query: $search, organizationId: $organizationId) {
            edges {
              node {
                id
                label
                customerId
              }
            }
          }
        }
      `,
      {
        search: searchString,
        organizationId: org?.organizationByKey?.id!,
      },
      {
        fetchPolicy: 'store-or-network',
      },
    )
      .toPromise()
      .then((docs) => {
        setOptions(
          docs?.searchCustomer.edges.map((res) => ({
            id: res?.node?.id,
            label: res?.node?.label,
          })) ?? [],
        );
      });
  }, [env, org?.organizationByKey?.id, searchString]);

  const intl = useIntl();

  return (
    <Select
      isLoading={false}
      searchable={true}
      type="search"
      placeholder={intl.formatMessage({
        defaultMessage: 'Search customer',
      })}
      autoFocus
      onChange={({ option }) => {
        const value = option?.[0]?.id ?? option?.id;

        if (value) {
          props.onSelectCustomer(value);
        }
      }}
      filterOptions={(options, filterValue) => {
        return options;
      }}
      options={options}
      onInputChange={(e) => {
        setSearchString(e.currentTarget.value);
      }}
    />
  );
}
