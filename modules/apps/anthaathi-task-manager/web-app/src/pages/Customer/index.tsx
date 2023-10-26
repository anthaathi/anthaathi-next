import { ContentWrapper } from '@anthaathi/components';
import { useIntl } from 'react-intl';
import { graphql, useLazyLoadQuery } from 'react-relay';
import { useOrganizationContext } from '@/hooks/use-organization-id';
import { CustomerQuery } from '../../../__generated__/CustomerQuery.graphql';
import { Block } from 'baseui/block';
import { CustomerTable } from '@/features/Customer/CustomerTable';

export default function Customer() {
  const intl = useIntl();

  const org = useOrganizationContext();

  const customersQueryData = useLazyLoadQuery<CustomerQuery>(
    graphql`
      query CustomerQuery($organizationId: ID!) {
        ...CustomerTable_customers @arguments(organizationId: $organizationId)
      }
    `,
    {
      organizationId: org?.organizationByKey?.id!,
    }
  );

  return (
    <ContentWrapper
      title={intl.formatMessage({
        defaultMessage: 'Customers',
      })}
      toolbarTab={[
        {
          title: intl.formatMessage({
            defaultMessage: 'Customers',
          }),
        },
      ]}
      breadcrumb={[
        {
          title: intl.formatMessage({
            defaultMessage: 'All customers',
          }),
        },
      ]}
    >
      <CustomerTable customers={customersQueryData} />

      <Block paddingBottom="scale200" />
    </ContentWrapper>
  );
}
