import { graphql, useFragment } from 'react-relay';
import { CustomerGroupInfoCard_customerGroup$key } from '../../../../__generated__/CustomerGroupInfoCard_customerGroup.graphql';
import React from 'react';
import {
  CardContent,
  CardTitle,
  DetailViewerCard,
} from '@anthaathi/components';
import { useIntl } from 'react-intl';
import { LabelMedium, LabelSmall } from 'baseui/typography';
import { useStyletron } from 'baseui';

export interface CustomerGroupInfoCardProps {
  $key: CustomerGroupInfoCard_customerGroup$key;
}

export function CustomerGroupInfoCard(props: CustomerGroupInfoCardProps) {
  const groupInfo = useFragment(
    graphql`
      fragment CustomerGroupInfoCard_customerGroup on CustomerGroup {
        id
        name
        description
        type
      }
    `,
    props.$key
  );

  const intl = useIntl();

  const [, $theme] = useStyletron();

  return (
    <>
      <DetailViewerCard>
        <CardTitle>
          {intl.formatMessage({ defaultMessage: 'Group name' })}
        </CardTitle>

        <CardContent>
          <LabelSmall
            $style={{
              color: $theme.colors.contentSecondary,
            }}
          >
            {intl.formatMessage({ defaultMessage: 'Name' })}
          </LabelSmall>
          <LabelMedium>{groupInfo.name}</LabelMedium>

          <LabelSmall
            marginTop="scale300"
            $style={{
              color: $theme.colors.contentSecondary,
            }}
          >
            {intl.formatMessage({ defaultMessage: 'Description:' })}
          </LabelSmall>

          <LabelMedium>{groupInfo.description ?? '-'}</LabelMedium>

          <LabelSmall
            marginTop="scale300"
            $style={{
              color: $theme.colors.contentSecondary,
            }}
          >
            {intl.formatMessage({ defaultMessage: 'Type:' })}
          </LabelSmall>

          <LabelMedium>{groupInfo.type ?? '-'}</LabelMedium>
        </CardContent>
      </DetailViewerCard>
    </>
  );
}
