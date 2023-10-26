import { ContentWrapper, DataTableV2 } from '@anthaathi/components';
import { useIntl } from 'react-intl';
import { Group } from '@carbon/icons-react';
import { graphql, useLazyLoadQuery, usePaginationFragment } from 'react-relay';
import {
  useOrganizationContext,
} from '@/hooks/use-organization-id';
import { CustomerGroupsQuery } from '../../../__generated__/CustomerGroupsQuery.graphql';
import { CustomerGroups_customerGroups$key } from '../../../__generated__/CustomerGroups_customerGroups.graphql';
import { useMemo } from 'react';
import { useAppNavigate } from '@/hooks/use-app-navigate';

export default function CustomerGroups() {
  const intl = useIntl();

  const organization = useOrganizationContext();

  const customerGroups = useLazyLoadQuery<CustomerGroupsQuery>(
    graphql`
      query CustomerGroupsQuery($organization: ID!) {
        ...CustomerGroups_customerGroups @arguments(organization: $organization)
      }
    `,
    {
      organization: organization?.organizationByKey?.id!,
    }
  );

  const { data: customerGroupPaginated } = usePaginationFragment(
    graphql`
      fragment CustomerGroups_customerGroups on Query
      @refetchable(queryName: "CustomerGroupsPaginationQuery")
      @argumentDefinitions(
        after: { type: "String" }
        first: { type: "Int" }
        organization: { type: "ID!" }
      ) {
        customerGroups(
          after: $after
          first: $first
          organization: $organization
				) @connection(key: "CustomerGroups_customerGroups") {
					edges {
            node {
              id
              iid
              name
              description
            }
          }
        }
      }
    `,
    customerGroups as CustomerGroups_customerGroups$key
  );

  const data = useMemo(() => {
    return customerGroupPaginated.customerGroups.edges.map((res, index) => ({
      id: res?.node.id ?? index,
      title: res?.node.name ?? '-',
      description: res?.node.description,
      iid: res?.node.iid,
    }));
  }, [customerGroupPaginated.customerGroups.edges]);

  const navigate = useAppNavigate();

  return (
    <ContentWrapper
      title={intl.formatMessage({ defaultMessage: 'Customer groups' })}
      breadcrumb={[
        {
          title: intl.formatMessage({ defaultMessage: 'Tasks' }),
        },
      ]}
      toolbarTab={[
        {
          title: intl.formatMessage({ defaultMessage: 'All groups' }),
        },
      ]}
      toolbarActions={[]}
    >
      <DataTableV2
        actions={[
          {
            key: 'view',
            label: intl.formatMessage({ defaultMessage: 'View' }),
          },
          {
            key: 'add-new-customer',
            label: intl.formatMessage({ defaultMessage: 'Add new customer' }),
          },
        ]}
        schema={{
          type: 'object',
          properties: {
            title: {
              type: 'string',
              title: intl.formatMessage({ defaultMessage: 'Title' }),
            },
            description: {
              type: 'string',
              title: intl.formatMessage({ defaultMessage: 'Description' }),
            },
          },
        }}
        onClick={(data) => {
          navigate('/customer-groups/' + data.iid);
        }}
        defaultIcon={<Group />}
        data={data ?? []}
      />
    </ContentWrapper>
  );
}
