import { ContentWrapper } from '@anthaathi/components';
import { useIntl } from 'react-intl';
import React from 'react';
import { graphql, useLazyLoadQuery } from 'react-relay';
import { useParams } from 'react-router-dom';
import { CustomerInfoQuery } from '../../../__generated__/CustomerInfoQuery.graphql';
import { Block } from 'baseui/block';
import CustomerCard from '@/features/Customer/CustomerCard';
import { useStyletron } from 'baseui';
import { CustomerAddressList } from '@/features/Customer/CustomerAddressList';
import { CustomerKPI } from '@/features/Customer/CustomerKPI';
import { TaskList } from '@/features/Task/TaskList';
import { useOrganizationContext } from '@/hooks/use-organization-id';

export default function CustomerInfo() {
  const intl = useIntl();

  const [css] = useStyletron();

  const params = useParams<{ id: string }>();

  const organization = useOrganizationContext();

  const customerInfo = useLazyLoadQuery<CustomerInfoQuery>(
    graphql`
      query CustomerInfoQuery($customerId: ID!, $organizationId: ID!) {
        node(id: $customerId) {
          id

          ... on Customer {
            id
            ...CustomerCard_customer
            ...CustomerAddressList_customer

            template {
              name
            }
          }
        }

        ...TaskList_taskFragment
          @arguments(customerId: $customerId, organization: $organizationId)
      }
    `,
    {
      customerId: `gid://Anthaathi/Customer/` + params.id,
      organizationId: organization?.organizationByKey?.id!,
    }
  );

  const [, $theme] = useStyletron();

  return (
    <ContentWrapper
      title={
        customerInfo.node?.template?.name
          ? customerInfo.node?.template?.name
          : intl.formatMessage({
              defaultMessage: 'Customers',
            })
      }
      toolbarTab={[
        {
          title: intl.formatMessage({
            defaultMessage: 'Overview',
          }),
        },
      ]}
      fullWidth={false}
      maxWidth="1420px"
      breadcrumb={[
        {
          title: intl.formatMessage({
            defaultMessage: 'All Customers',
          }),
          to: './..',
        },
      ]}
    >
      <Block
        display="flex"
        flexDirection={['column-reverse', 'column-reverse', 'row']}
        maxWidth="1420px"
        $style={{
          gap: '12px',
        }}
      >
        <div
          className={css({
            flexGrow: 1,
          })}
        >
          <CustomerKPI />

          <Block paddingBottom="scale800" />

          <TaskList $key={customerInfo} />
        </div>
        <div
          className={css({
            width: '100%',
            [$theme.mediaQuery.medium]: {
              width: '30%',
              maxWidth: '400px',
            },
          })}
        >
          <CustomerCard $key={customerInfo.node!} />
          <CustomerAddressList $key={customerInfo.node!} />
        </div>
      </Block>
    </ContentWrapper>
  );
}
