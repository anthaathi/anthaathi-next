'use client';
import React, { useState } from 'react';
import PromptCard from '@/features/PromptCard';
import {
  OktaCommonFieldRenderer,
  OktaInputRenderer,
  OktaMessageRenderer,
} from '@/features/OktaCommon';
import { StyledLink } from 'baseui/link';
import { useStyletron } from 'baseui';
import { Button } from 'baseui/button';
import { useIntl } from 'react-intl';
import { RecoveryFlow, UiNodeInputAttributes } from '@ory/kratos-client';
import Link from 'next/link';

export function RecoveryContainer(props: {
  flow: RecoveryFlow;
  companyName: string;
}) {
  const [css, $theme] = useStyletron();
  const intl = useIntl();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const actionURL = props.flow!.ui.action;

  return (
    <PromptCard
      companyName={props.companyName}
      appName={intl.formatMessage({
        defaultMessage: 'Account recovery',
        id: 'ZRAJ8j',
      })}
    >
      <form
        action={actionURL}
        onSubmit={() => {
          setIsSubmitting(true);
        }}
        method={(props.flow as RecoveryFlow)!.ui.method}
      >
        <OktaMessageRenderer flow={(props.flow as RecoveryFlow)!} />
        <OktaCommonFieldRenderer flow={(props.flow as RecoveryFlow)!} />
        <OktaInputRenderer nodes={props.flow.ui.nodes} />

        <div
          className={css({
            display: 'flex',
            marginTop: $theme.sizing.scale800,
          })}
        >
          <Button
            name="method"
            value={
              (
                (props.flow as RecoveryFlow).ui?.nodes?.find(
                  (res) =>
                    res.type === 'input' &&
                    (res.attributes as UiNodeInputAttributes).type === 'submit',
                )?.attributes as UiNodeInputAttributes
              )?.value
            }
            type="submit"
            isLoading={isSubmitting}
            overrides={{ Root: { style: { width: '100%' } } }}
          >
            {(props.flow as RecoveryFlow).state === 'choose_method'
              ? intl.formatMessage({
                  defaultMessage: 'Send recovery link',
                  id: 'AeOnbI',
                })
              : intl.formatMessage({ defaultMessage: 'Verify', id: 'q5Xl0M' })}
          </Button>
        </div>
      </form>
      <div
        className={css({
          display: 'flex',
          alignItems: 'center',
          placeContent: 'center',
          marginTop: $theme.sizing.scale800,
        })}
      >
        <StyledLink
          $as={Link}
          href={`/v1/sign-in?return-url=${encodeURIComponent(
            props.flow.return_to ?? '/',
          )}`}
        >
          {intl.formatMessage({
            defaultMessage: 'Return to Login',
            id: 'HBfJcf',
          })}
        </StyledLink>
        <span className={css({ flexGrow: 1 })} />
      </div>
    </PromptCard>
  );
}
