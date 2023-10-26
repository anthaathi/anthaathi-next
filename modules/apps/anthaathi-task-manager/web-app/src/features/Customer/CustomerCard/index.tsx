import { FormattedMessage, useIntl } from 'react-intl';
import { graphql, useFragment } from 'react-relay';
import { CustomerCard_customer$key } from '../../../../__generated__/CustomerCard_customer.graphql';
import {
  CardContent,
  CardTitle,
  DetailViewerCard,
  FormDataViewer,
} from '@anthaathi/components';
import { LabelMedium, LabelSmall } from 'baseui/typography';
import { Block } from 'baseui/block';
import { useStyletron } from 'baseui';
import { StyledLink } from 'baseui/link';
import React, { Suspense, useState } from 'react';
import { Button } from 'baseui/button';
import { CustomerEdit } from '@/features/Customer/CustomerEdit';
import { Modal, ModalBody, ModalHeader } from 'baseui/modal';

export interface CustomerCardProps {
  $key: CustomerCard_customer$key;
  collapsed?: boolean;
}

export default function CustomerCard(props: CustomerCardProps) {
  const intl = useIntl();

  const [css, $theme] = useStyletron();

  const data = useFragment(
    graphql`
      fragment CustomerCard_customer on Customer {
        id
        firstName
        lastName
        phoneNumber
        email
        data
        company
        ...CustomerEdit_customer
        template {
          id
          name
          description
          config
          iid
        }
      }
    `,
    props.$key
  );

  const [collapsed, setCollapsed] = useState(props.collapsed ?? true);

  const [isEditing, setIsEditing] = useState(false);

  return (
    <DetailViewerCard>
      <Modal
        isOpen={isEditing}
        onClose={() => {
          setIsEditing(false);
        }}
        overrides={{
          Dialog: {
            style: {
              maxWidth: '800px',
            },
          },
        }}
      >
        <ModalHeader>
          <FormattedMessage
            defaultMessage="Edit {type}"
            values={{
              type: data.template?.name
                ? data.template.name
                : intl.formatMessage({
                    defaultMessage: 'customer',
                  }),
            }}
          />
        </ModalHeader>
        <ModalBody>
          <Suspense>
            <div
              className={css({
                maxWidth: '800px',
                margin: '0 auto',
              })}
            >
              <CustomerEdit
                $key={data}
                onEdit={() => {
                  setIsEditing(false);
                }}
              />
            </div>
          </Suspense>
        </ModalBody>
      </Modal>
      <CardTitle>
        {data.template?.name
          ? data.template.name
          : intl.formatMessage({ defaultMessage: 'Customer' })}

        <span
          className={css({
            flexGrow: 1,
          })}
        />

        <StyledLink
          href="#"
          onClick={(e: any) => {
            e.preventDefault();

            setIsEditing(true);
          }}
        >
          {intl.formatMessage({ defaultMessage: 'Edit' })}
        </StyledLink>
      </CardTitle>
      <CardContent $style={{ paddingTop: 0, paddingBottom: 0 }}>
        <Block>
          <LabelSmall
            $style={{
              color: $theme.colors.contentSecondary,
            }}
          >
            {intl.formatMessage({ defaultMessage: 'Name' })}
          </LabelSmall>
          <LabelMedium>
            {data.firstName} {data.lastName}
          </LabelMedium>

          <LabelSmall
            marginTop="scale300"
            $style={{
              color: $theme.colors.contentSecondary,
            }}
          >
            {intl.formatMessage({ defaultMessage: 'Company:' })}
          </LabelSmall>

          <LabelMedium>{data.company ?? '-'}</LabelMedium>
        </Block>
      </CardContent>

      {(!props.collapsed || !collapsed) && (
        <>
          <CardTitle>
            {intl.formatMessage({ defaultMessage: 'Contact information' })}
          </CardTitle>

          <CardContent
            $style={{
              marginTop: 0,
              paddingTop: 0,
              marginBottom: 0,
              paddingBottom: '24px',
            }}
          >
            <Block>
              <LabelSmall
                $style={{
                  color: $theme.colors.contentSecondary,
                }}
              >
                {intl.formatMessage({ defaultMessage: 'Phone Number:' })}{' '}
              </LabelSmall>
              <LabelMedium marginTop="scale200">
                {data.phoneNumber ? (
                  <StyledLink href={'tel:' + data.phoneNumber}>
                    {data.phoneNumber}
                  </StyledLink>
                ) : (
                  '-'
                )}
              </LabelMedium>
              <LabelSmall
                marginTop="scale600"
                $style={{
                  color: $theme.colors.contentSecondary,
                }}
              >
                {intl.formatMessage({ defaultMessage: 'Email:' })}{' '}
              </LabelSmall>
              <LabelMedium marginTop="scale200">
                {data.email ? (
                  <StyledLink href={'mailto:' + data.email}>
                    {data.email}
                  </StyledLink>
                ) : (
                  '-'
                )}
              </LabelMedium>
            </Block>

            {data.template?.config && (
              <div
                className={css({
                  marginLeft: '-16px',
                  marginRight: '-16px',
                })}
              >
                <FormDataViewer
                  data={data.data}
                  schema={data.template?.config}
                />
              </div>
            )}
          </CardContent>
        </>
      )}

      {props.collapsed && (
        <CardContent>
          <Button
            size="mini"
            kind="tertiary"
            onClick={() => {
              setCollapsed(!collapsed);
            }}
          >
            {collapsed ? 'Show more' : 'Show less'}
          </Button>
        </CardContent>
      )}
    </DetailViewerCard>
  );
}
