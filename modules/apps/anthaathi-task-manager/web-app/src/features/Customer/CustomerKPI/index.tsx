import React from 'react';
import { BadgeList, BadgeListItem, BadgeSize } from '@anthaathi/components';
import { useIntl } from 'react-intl';

export function CustomerKPI() {
  const intl = useIntl();

  return (
    <>
      <BadgeList $size={BadgeSize.SMALL}>
        <BadgeListItem
          title={intl.formatMessage({ defaultMessage: 'Total tasks' })}
        >
          {10}
        </BadgeListItem>
        <BadgeListItem
          title={intl.formatMessage({ defaultMessage: 'Pending tasks' })}
        >
          {10}
        </BadgeListItem>
        <BadgeListItem
          title={intl.formatMessage({ defaultMessage: 'Closed tasks' })}
        >
          {10}
        </BadgeListItem>
        <BadgeListItem
          title={intl.formatMessage({ defaultMessage: 'Completed tasks' })}
        >
          {10}
        </BadgeListItem>
      </BadgeList>
    </>
  );
}
