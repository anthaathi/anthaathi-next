'use client';
import React, { useState } from 'react';
import { LoginFlow, UiNodeInputAttributes } from '@ory/kratos-client';
import PromptCard from '@/features/PromptCard';
import {
  OIDCRenderer,
  OktaCommonFieldRenderer,
  OktaInputRenderer,
  OktaMessageRenderer,
} from '@/features/OktaCommon';
import { StyledLink } from 'baseui/link';
import { useStyletron } from 'baseui';
import { Button } from 'baseui/button';
import { LabelMedium } from 'baseui/typography';
import { DividerWithText } from '@/features/CommonUI/DividerWithText';
import { useIntl } from 'react-intl';
import Link from 'next/link';

export function SignInContainer(props: {
  flow: LoginFlow;
  companyName: string;
  appName: string;
}) {
  const [css, $theme] = useStyletron();
  const intl = useIntl();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const actionURL = props.flow!.ui.action;

  const submitButton = props.flow.ui.nodes.find(
    (res) =>
      res.type === 'input' &&
      (res.attributes as UiNodeInputAttributes).type === 'submit' &&
      (res.group === 'password' || res.group === 'lookup_secret'),
  );

  const includeSubmit =
    props.flow.ui.nodes.findIndex(
      (node) => node.group === 'totp' || node.group === 'lookup_secret',
    ) !== -1;

  if (includeSubmit) {
    const methodsAvailable = ['totp', 'lookup_secret'].filter((res) =>
      props.flow.ui.nodes.filter((node) => node.group === res),
    );
    return (
      <PromptCard
        companyName={props.companyName}
        appName={props.appName}
        caption={intl.formatMessage({
          defaultMessage: 'Sign in to continue to',
          id: 'bMAB3p',
        })}
      >
        <>
          <OktaMessageRenderer flow={props.flow as LoginFlow} />
        </>
        {methodsAvailable.map((res, index) => (
          <form
            key={res}
            action={actionURL}
            onSubmit={() => {
              setIsSubmitting(true);
            }}
            method={props.flow.ui.method}
          >
            <OktaCommonFieldRenderer flow={props.flow as LoginFlow} />
            <OktaInputRenderer
              disableAutoFocus={index !== 0}
              includeSubmit={true}
              nodes={props.flow.ui.nodes.filter((node) => node.group === res)}
            />
          </form>
        ))}
      </PromptCard>
    );
  }

  return (
    <PromptCard
      companyName={props.companyName}
      appName={props.appName}
      caption={intl.formatMessage({
        defaultMessage: 'Sign in to continue to',
        id: 'bMAB3p',
      })}
    >
      <form
        action={actionURL}
        onSubmit={() => {
          setIsSubmitting(true);
        }}
        method={props.flow.ui.method}
      >
        <OktaMessageRenderer flow={props.flow as LoginFlow} />
        <OktaCommonFieldRenderer flow={props.flow as LoginFlow} />
        <>
          <OktaInputRenderer nodes={props.flow.ui.nodes} />
        </>

        {!props.flow.refresh && (
          <StyledLink
            $as={Link}
            href={`/v1/recovery?return-url=${encodeURIComponent(
              props.flow.return_to ?? '/',
            )}`}
          >
            {intl.formatMessage({
              defaultMessage: 'Forget password?',
              id: 'HpQpwf',
            })}
          </StyledLink>
        )}

        {!includeSubmit && (
          <div
            className={css({
              display: 'flex',
              marginTop: $theme.sizing.scale800,
            })}
          >
            <Button
              {...(submitButton?.attributes as UiNodeInputAttributes)}
              type="submit"
              isLoading={isSubmitting}
              overrides={{ Root: { style: { width: '100%' } } }}
            >
              {intl.formatMessage({ defaultMessage: 'Sign In', id: 'Ub+AGc' })}
            </Button>
          </div>
        )}
      </form>
      {!props.flow?.refresh && (
        <div
          className={css({
            display: 'flex',
            alignItems: 'center',
            placeContent: 'center',
            marginTop: $theme.sizing.scale800,
          })}
        >
          <LabelMedium marginRight="scale200">
            {intl.formatMessage({
              defaultMessage: "Don't have an account yet?",
              id: 'bNwHXF',
            })}
          </LabelMedium>
          <StyledLink
            $as={Link}
            href={`/v1/sign-up?return-url=${encodeURIComponent(
              props.flow.return_to ?? '/',
            )}`}
          >
            {intl.formatMessage({
              defaultMessage: 'Register now',
              id: 'yvaOvO',
            })}
          </StyledLink>
          <span className={css({ flexGrow: 1 })} />
        </div>
      )}

      {props.flow?.ui?.nodes?.filter((res) => res.group === 'oidc')?.length !==
        0 && (
        <DividerWithText>
          {intl.formatMessage({ defaultMessage: 'Or', id: '4wpUNc' })}
        </DividerWithText>
      )}

      <div
        className={css({
          marginTop: $theme.sizing.scale800,
        })}
      >
        <OIDCRenderer flow={props.flow as LoginFlow} />
      </div>
    </PromptCard>
  );
}
