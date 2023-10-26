import { ContentWrapper } from '@anthaathi/components';
import React from 'react';
import { OrderList } from '@/features/Order/components/OrderList';
import { Block } from 'baseui/block';
import { useIntl } from 'react-intl';

export default function Order() {
  const intl = useIntl();

  return (
    <ContentWrapper
      title={intl.formatMessage({ defaultMessage: 'Orders' })}
      breadcrumb={[
        {
          title: 'Anthaathi ESG',
        },
      ]}
      toolbarTab={[
        {
          title: 'All orders',
        },
      ]}
      fullWidth
    >
      <Block padding="scale300">
        <OrderList />
      </Block>
    </ContentWrapper>
  );
}
