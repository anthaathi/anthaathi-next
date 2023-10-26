'use client';

import { SettingsFlow } from '@ory/kratos-client';
import { OktaMessageRenderer } from '@/features/OktaCommon';
import { useStyletron } from 'baseui';
import { OktaSettingsRenderer } from '@/features/OktaCommon/AccountPageRenderer';
import React from 'react';
import { Block } from 'baseui/block';

export function FlowRenderer({ flow }: { flow: SettingsFlow }) {
  const [css] = useStyletron();

  return (
    <div
      className={css({
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
      })}
    >
      <Block padding="scale600">
        <OktaMessageRenderer flow={flow as SettingsFlow} />
      </Block>
      <OktaSettingsRenderer flow={flow} />
    </div>
  );
}
