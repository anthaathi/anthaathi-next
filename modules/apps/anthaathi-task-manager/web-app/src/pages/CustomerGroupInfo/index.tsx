import { ContentWrapper } from '@anthaathi/components';
import { useIntl } from 'react-intl';
import { graphql, useLazyLoadQuery } from 'react-relay';
import { CustomerGroupInfoQuery } from '../../../__generated__/CustomerGroupInfoQuery.graphql';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import { useOrganizationContext } from '@/hooks/use-organization-id';

export default function CustomerGroupInfo() {
  const intl = useIntl();

  const { id } = useParams<{ id: string }>();

  const org = useOrganizationContext();
  const location = useLocation();

  const group = useLazyLoadQuery<CustomerGroupInfoQuery>(
    graphql`
      query CustomerGroupInfoQuery(
        $id: ID!
        $organizationId: ID!
        $isCustomerTab: Boolean!
      ) {
        node(id: $id) {
          id
          ... on CustomerGroup {
            id
            name
            ...CustomerGroupInfoCard_customerGroup @skip(if: $isCustomerTab)
            ...CustomerGroupInfoTabOverviewQuery @skip(if: $isCustomerTab)
          }
        }

        ...CustomerTable_customers
          @arguments(organizationId: $organizationId)
          @include(if: $isCustomerTab)

        ...TaskList_taskFragment
          @arguments(organization: $organizationId, customerGroupId: $id)
          @skip(if: $isCustomerTab)
      }
    `,
    {
      id: `gid://Anthaathi/CustomerGroup/${id}`,
      organizationId: org?.organizationByKey?.id!,
      isCustomerTab: location.pathname.endsWith('customer'),
    }
  );

  return (
    <ContentWrapper
      title={intl.formatMessage({ defaultMessage: 'Customer group' })}
      breadcrumb={[
        {
          title: intl.formatMessage({ defaultMessage: 'Customer groups' }),
        },
      ]}
      toolbarTab={[
        {
          title: intl.formatMessage({ defaultMessage: 'Overview' }),
          to: `/o/${org?.organizationByKey?.key}/customer-groups/${id}`,
        },
        {
          title: intl.formatMessage({ defaultMessage: 'Customers' }),
          to: `/o/${org?.organizationByKey?.key}/customer-groups/${id}/customer`,
        },
      ]}
    >
      <Outlet context={group} />
    </ContentWrapper>
  );
}
