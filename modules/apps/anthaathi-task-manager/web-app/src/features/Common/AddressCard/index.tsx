import { graphql, useFragment } from 'react-relay';
import { AddressCard_address$key } from '../../../../__generated__/AddressCard_address.graphql';
import { CardContent, DetailViewerCard } from '@anthaathi/components';
import React from 'react';
import { LabelMedium, LabelSmall } from 'baseui/typography';
import { useIntl } from 'react-intl';
import { useStyletron } from 'baseui';

export interface AddressCardProps {
  $key: AddressCard_address$key;
}

export function AddressCard(props: AddressCardProps) {
  const data = useFragment(
    graphql`
      fragment AddressCard_address on Address {
        id
        title
        street
        city
        state
        landmark
        zipCode
        country
      }
    `,
    props.$key
  );

  const [, $theme] = useStyletron();

  const intl = useIntl();

  return (
    <DetailViewerCard title={data.title}>
      <CardContent $style={{ paddingTop: '0' }}>
        <LabelSmall color={$theme.colors.contentSecondary}>
          {intl.formatMessage({ defaultMessage: 'Street' })}
        </LabelSmall>
        <LabelMedium marginBottom="scale400">{data.street ?? '-'}</LabelMedium>

        <LabelSmall color={$theme.colors.contentSecondary}>
          {intl.formatMessage({ defaultMessage: 'City' })}
        </LabelSmall>
        <LabelMedium marginBottom="scale400">{data.city ?? '-'}</LabelMedium>

        <LabelSmall color={$theme.colors.contentSecondary}>
          {intl.formatMessage({ defaultMessage: 'State' })}
        </LabelSmall>
        <LabelMedium marginBottom="scale400">{data.state ?? '-'}</LabelMedium>

        <LabelSmall color={$theme.colors.contentSecondary}>
          {intl.formatMessage({ defaultMessage: 'Landmark' })}
        </LabelSmall>
        <LabelMedium marginBottom="scale400">{data.landmark ?? '-'}</LabelMedium>

        <LabelSmall color={$theme.colors.contentSecondary}>
          {intl.formatMessage({ defaultMessage: 'Zip code' })}
        </LabelSmall>
        <LabelMedium marginBottom="scale400">{data.zipCode ?? '-'}</LabelMedium>

        <LabelSmall color={$theme.colors.contentSecondary}>
          {intl.formatMessage({ defaultMessage: 'Country' })}
        </LabelSmall>
        <LabelMedium marginBottom="scale400">{data.country ?? '-'}</LabelMedium>
      </CardContent>
    </DetailViewerCard>
  );
}
