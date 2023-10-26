'use client';
import { useStyletron } from 'baseui';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import PromptCard from '@/features/PromptCard';
import {
  OktaCommonFieldRenderer,
  OktaInputRenderer,
  OktaMessageRenderer,
} from '@/features/OktaCommon';
import { Button } from 'baseui/button';
import { VerificationFlow } from '@ory/kratos-client';

export function VerificationContainer(props: {
  flow: VerificationFlow;
  companyName: string;
  appName: string;
}) {
  const [css, $theme] = useStyletron();
  const intl = useIntl();
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <PromptCard
      companyName={props.companyName}
      appName={props.appName}
      caption={intl.formatMessage({
        defaultMessage: 'Verify your account',
        id: 'oBSCG0',
      })}
    >
      <form
        action={props.flow!.ui.action}
        onSubmit={() => {
          setIsSubmitting(true);
        }}
        method={props.flow!.ui.method}
      >
        <OktaMessageRenderer flow={props.flow as VerificationFlow} />
        <OktaCommonFieldRenderer flow={props.flow as VerificationFlow} />
        <OktaInputRenderer flow={props.flow as VerificationFlow} />

        <div
          className={css({
            display: 'flex',
            marginTop: $theme.sizing.scale800,
          })}
        >
          <Button
            name="method"
            value="link"
            type="submit"
            isLoading={isSubmitting}
            overrides={{ Root: { style: { width: '100%' } } }}
          >
            {intl.formatMessage({ defaultMessage: 'Verify', id: 'q5Xl0M' })}
          </Button>
        </div>
      </form>
    </PromptCard>
  );
}
