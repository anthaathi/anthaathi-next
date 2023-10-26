'use client';
/*
 * Copyright (c) Anthaathi Private Limited 2023.
 *
 * This code is the exclusive property of Anthaathi Private Limited and is protected by copyright and intellectual property laws.
 * Any unauthorized use, reproduction, distribution, or modification of this code is strictly prohibited.
 *
 * Anthaathi Private Limited reserves all rights in and to this code and will vigorously defend its intellectual property rights.
 */

import {
  LoginFlow,
  RecoveryFlow,
  RegistrationFlow,
  SettingsFlow,
  UiNodeInputAttributes,
  VerificationFlow,
} from '@ory/kratos-client';
import React, { useMemo } from 'react';
import {
  OktaCommonFieldRenderer,
  OktaInputRenderer,
} from '@/features/OktaCommon';
import { styled, useStyletron } from 'baseui';
import { expandBorderStyles } from 'baseui/styles';
import { FormattedMessage, useIntl } from 'react-intl';
import { Navigation } from 'baseui/side-navigation';
import { Button } from 'baseui/button';
import { Block } from 'baseui/block';
import { HeadingXSmall, LabelMedium } from 'baseui/typography';
import { Accordion, Panel } from 'baseui/accordion';

export function OktaSettingsRenderer(props: {
  flow:
    | LoginFlow
    | RegistrationFlow
    | RecoveryFlow
    | VerificationFlow
    | SettingsFlow;
}) {
  const flowItems = useMemo(() => {
    return props.flow.ui.nodes;
  }, [props.flow.ui.nodes]);

  const actionURL = props.flow!.ui.action;

  const [css, $theme] = useStyletron();

  const intl = useIntl();

  const navigation = (
    <Navigation
      onChange={() => {}}
      items={Object.keys(Data)
        .filter(
          (res) => flowItems.findIndex((item) => item.group === res) !== -1,
        )
        .map((res) => ({
          title: Data[res].title,
          itemId: '#' + res,
        }))}
    />
  );

  return (
    <div
      className={css({
        marginTop: 0,
        display: 'flex',
        [$theme.mediaQuery.medium]: {
          marginTop: '24px',
        },
      })}
    >
      <div
        className={css({
          width: '320px',
          flexShrink: 0,
          display: 'none',
          [$theme.mediaQuery.large]: {
            display: 'block',
          },
        })}
      >
        {navigation}
      </div>
      <div
        className={css({
          flexGrow: 1,
        })}
      >
        <Block display={['flex', 'flex', 'none', 'none']}>
          <Accordion accordion>
            <Panel
              overrides={{
                Content: {
                  style: {
                    paddingTop: 0,
                    paddingBottom: 0,
                    paddingLeft: 0,
                    paddingRight: 0,
                  },
                },
              }}
              title={intl.formatMessage({
                defaultMessage: 'Navigation',
                id: 'fBg+7V',
              })}
            >
              {navigation}
            </Panel>
          </Accordion>
        </Block>
        {Object.keys(Data).map((key) => {
          const nodes = flowItems.filter(
            (res) =>
              res.group === key &&
              (res.attributes as UiNodeInputAttributes).type !== 'submit',
          );

          const submit = flowItems.find(
            (res) =>
              res.group === key &&
              (res.attributes as UiNodeInputAttributes).type === 'submit',
          );

          const submitContent = submit && (
            <Button
              {...(submit.attributes as UiNodeInputAttributes)}
              type="submit"
              startEnhancer={renderContext({
                context: submit.meta.label?.context ?? {},
              })}
            >
              {'provider' in (submit.meta.label?.context || {})
                ? intl.formatMessage(
                    {
                      defaultMessage: `Continue with {provider}`,
                      id: '/tiBYY',
                    },
                    {
                      provider: (
                        <span
                          className={css({
                            display: 'block',
                            textTransform: 'capitalize',
                          })}
                        >
                          &nbsp;
                          {(submit.meta.label?.context as any).provider}
                        </span>
                      ),
                    },
                  )
                : submit.meta?.label?.text}
            </Button>
          );

          return (
            <StyledCard
              id={key}
              $style={{
                marginBottom: '24px',
              }}
              key={key}
              $as="form"
              action={actionURL}
              method={props.flow.ui.method}
            >
              <Block
                padding="12px"
                display="flex"
                flexDirection={['column', 'column', 'row']}
              >
                <Block
                  width={[
                    'calc(100% - 24px - 24px)',
                    'calc(100% - 24px - 24px)',
                    'calc(50% - 24px - 24px)',
                  ]}
                  paddingTop={['8px', '8px', '24px']}
                  paddingBottom={['24px', '24px', '24px']}
                  paddingRight={['0', '0', '24px']}
                  paddingLeft={['0', '0', '24px']}
                  display="flex"
                  flexDirection="column"
                  placeContent="center"
                  alignContent="center"
                >
                  <HeadingXSmall marginBottom="scale200" marginTop="0">
                    {Data[key].title}
                  </HeadingXSmall>
                  <LabelMedium>{Data[key].description}</LabelMedium>
                </Block>
                <Block
                  width={['100%', '100%', '50%']}
                  display={nodes.length === 0 ? 'flex' : 'block'}
                  alignItems="center"
                  placeContent="end"
                  flexDirection="row-reverse"
                >
                  {nodes.length === 0 && submitContent}
                  <OktaCommonFieldRenderer flow={props.flow} />
                  <OktaInputRenderer nodes={nodes} includeSubmit={true} />
                </Block>
              </Block>
              {nodes.length !== 0 && <ActionCard>{submitContent}</ActionCard>}
            </StyledCard>
          );
        })}
      </div>
    </div>
  );
}

const ActionCard = styled('div', ({ $theme }) => ({
  borderTopStyle: $theme.borders.border100.borderStyle,
  borderTopWidth: $theme.borders.border100.borderWidth,
  borderTopColor: $theme.borders.border100.borderColor,
  margin: '-12px',
  padding: '12px',
  width: 'calc(100%)',
  display: 'flex',
  flexDirection: 'row-reverse',
}));

const StyledCard = styled('div', ({ $theme }) => ({
  padding: '12px',
  ...expandBorderStyles($theme.borders.border100),
  borderRadius: $theme.borders.radius200,
  display: 'flex',
  flexDirection: 'column',
}));

const Data: Record<
  string,
  {
    title: React.ReactNode;
    description: React.ReactNode;
  }
> = {
  profile: {
    title: <FormattedMessage defaultMessage="Basic Profile" id="lpd5Na" />,
    description: (
      <FormattedMessage
        defaultMessage="Update your name, email address, and and customize your newsletter settings to stay informed about relevant updates."
        id="tPYgrC"
      />
    ),
  },

  password: {
    title: <FormattedMessage defaultMessage="Password" id="5sg7KC" />,
    description: (
      <FormattedMessage
        defaultMessage="Set a strong password that you do not use on other accounts."
        id="z3ZK03"
      />
    ),
  },
  oidc: {
    title: <FormattedMessage defaultMessage="Connected accounts" id="+pwUpZ" />,
    description: (
      <FormattedMessage
        defaultMessage="Your associated accounts used to login."
        id="1i9cST"
      />
    ),
  },
  lookup_secret: {
    title: (
      <FormattedMessage defaultMessage="Backup Recovery Codes" id="TxP/9x" />
    ),
    description: (
      <FormattedMessage
        defaultMessage="Generate and store new recovery codes for seamless account access when needed."
        id="uBzcCv"
      />
    ),
  },
  totp: {
    title: <FormattedMessage defaultMessage="Authenticator App" id="eoPp92" />,
    description: (
      <FormattedMessage
        defaultMessage="Manage your authenticator app secret. Add or remove the app for enhanced account security."
        id="TG7+RJ"
      />
    ),
  },
};

function renderContext({ context }: { context: object }) {
  switch ((context as any)?.provider) {
    case 'google':
      // eslint-disable-next-line @next/next/no-img-element
      return <img src="/oidc/google.svg" alt="Google" />;
  }
  return null;
}
