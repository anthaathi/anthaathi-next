'use client';
import React, { useState } from 'react';
import { RegistrationFlow } from '@ory/kratos-client';
import PromptCard from '@/features/PromptCard';
import {
  OIDCRenderer,
  OktaCommonFieldRenderer,
  OktaInputRenderer,
  OktaMessageRenderer,
} from '@/features/OktaCommon';
import { useStyletron } from 'baseui';
import { Button, KIND } from 'baseui/button';
import { DividerWithText } from '@/features/CommonUI/DividerWithText';
import { FormattedMessage, useIntl } from 'react-intl';
import { Block } from 'baseui/block';
import Link from 'next/link';

export function SignUpContainer(props: {
  flow: RegistrationFlow;
  companyName: string;
  appName: string;
}) {
  const [css, $theme] = useStyletron();
  const intl = useIntl();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const actionURL = (props.flow as RegistrationFlow).ui.action;
  const method = (props.flow as RegistrationFlow).ui.method;

  return (
    <PromptCard
      appName={props.appName}
      caption={intl.formatMessage({
        defaultMessage: 'Sign up to continue to',
        id: 'ku+82+',
      })}
    >
      <form
        action={actionURL}
        onSubmit={() => {
          setIsSubmitting(true);
        }}
        method={method}
      >
        <OktaMessageRenderer flow={props.flow as RegistrationFlow} />
        <OktaCommonFieldRenderer flow={props.flow as RegistrationFlow} />
        <OktaInputRenderer flow={props.flow as RegistrationFlow} />
        <Button
          type="submit"
          name="method"
          value="password"
          isLoading={isSubmitting}
          overrides={{ Root: { style: { width: '100%' } } }}
        >
          {intl.formatMessage({
            defaultMessage: 'Create Account',
            id: '5JcXdV',
          })}
        </Button>
      </form>

      <DividerWithText>
        {intl.formatMessage({ defaultMessage: 'OR', id: 'INlWvJ' })}
      </DividerWithText>

      <div className={css({ marginTop: $theme.sizing.scale800 })}>
        <OIDCRenderer flow={props.flow as RegistrationFlow} />
      </div>

      {props.flow?.ui?.nodes?.filter((res) => res.group === 'oidc')?.length !==
        0 && (
        <DividerWithText>
          {intl.formatMessage({ defaultMessage: 'OR', id: 'INlWvJ' })}
        </DividerWithText>
      )}

      <Block marginTop="scale600">
        <Button
          $as={Link}
          href={`/v1/sign-in?return-url=${encodeURIComponent(
            (props.flow as RegistrationFlow).return_to ?? '/',
          )}`}
          kind={KIND.secondary}
          overrides={{
            Root: {
              style: {
                width: `calc(100% - ${$theme.sizing.scale600} - ${$theme.sizing.scale600})`,
              },
            },
          }}
        >
          <FormattedMessage defaultMessage="Sign in instead" id="oJFW6g" />
        </Button>
      </Block>
    </PromptCard>
  );
}
