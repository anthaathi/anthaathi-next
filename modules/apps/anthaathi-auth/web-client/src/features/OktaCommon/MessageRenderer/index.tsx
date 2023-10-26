'use client';
/*
 * Copyright (c) Anthaathi Private Limited 2023.
 *
 * This code is the exclusive property of Anthaathi Private Limited and is protected by copyright and intellectual property laws.
 * Any unauthorized use, reproduction, distribution, or modification of this code is strictly prohibited.
 *
 * Anthaathi Private Limited reserves all rights in and to this code and will vigorously defend its intellectual property rights.
 */

import { Banner, Kind } from 'baseui/banner';
import {
  LoginFlow,
  RecoveryFlow,
  RegistrationFlow,
  SettingsFlow,
  UiTextTypeEnum,
  VerificationFlow,
} from '@ory/kratos-client';

export function OktaMessageRenderer(props: {
  flow:
    | LoginFlow
    | RegistrationFlow
    | RecoveryFlow
    | VerificationFlow
    | SettingsFlow;
}) {
  return (
    <>
      {props.flow.ui.messages?.map((res) => {
        const errorStates: Record<UiTextTypeEnum, Kind> = {
          error: 'warning',
          info: 'info',
          success: 'positive',
        };

        return (
          <Banner
            key={res.id}
            kind={errorStates[res.type]}
            overrides={{ Root: { style: { marginLeft: 0, marginRight: 0 } } }}
          >
            {res.text}
          </Banner>
        );
      })}
    </>
  );
}
