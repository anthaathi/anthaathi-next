'use client';

import PromptCard from '@/features/PromptCard';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { LabelMedium, LabelSmall } from 'baseui/typography';
import { useStyletron } from 'baseui';
import { Block } from 'baseui/block';
import { Button } from 'baseui/button';
import { useRouter, useSearchParams } from 'next/navigation';

export function ErrorHandler({
  id,
  companyName,
  message,
  appName,
  reason,
}: {
  id: string;
  appName: string;
  companyName: string;
  reason: string;
  message: string;
}) {
  const [css] = useStyletron();
  const router = useRouter();

  const searchParams = useSearchParams();

  switch (id) {
    case 'self_service_flow_return_to_forbidden':
    case 'security_csrf_violation':
    default:
      return (
        <PromptCard
          appName={appName}
          companyName={companyName}
          caption="Sign in to coninue to"
        >
          <LabelMedium
            $style={{
              textAlign: 'center',
            }}
          >
            <FormattedMessage
              defaultMessage="{error} {lineBreak} {message}"
              values={{
                error: (
                  <pre
                    className={css({
                      padding: 0,
                      margin: 0,
                    })}
                  >
                    {id}
                  </pre>
                ),
                lineBreak: <br />,
                message: message,
              }}
              id="N7WmSL"
            />
          </LabelMedium>

          {reason && (
            <>
              <br />
              <details>
                <LabelSmall as="summary">
                  <>
                    <FormattedMessage defaultMessage="Reason" id="AkCxS/" />
                  </>
                </LabelSmall>
                <LabelMedium paddingTop="scale200">{reason}</LabelMedium>
              </details>
            </>
          )}

          <Block
            marginTop="scale800"
            display="flex"
            alignContent="center"
            placeContent="center"
          >
            <Button
              onClick={() => {
                const searchParamsMut = new URLSearchParams(searchParams);

                searchParamsMut.delete('flow');

                router.push('/v1/sign-in?' + searchParamsMut.toString());
              }}
              overrides={{
                Root: {
                  style: {
                    width: '100%',
                    maxWidth: '220px',
                  },
                },
              }}
            >
              <FormattedMessage defaultMessage="Retry" id="62nsdy" />
            </Button>
          </Block>
        </PromptCard>
      );
  }
}
