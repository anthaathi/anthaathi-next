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
import { useMemo } from 'react';

export function OktaCommonFieldRenderer(props: {
  flow:
    | LoginFlow
    | RegistrationFlow
    | RecoveryFlow
    | VerificationFlow
    | SettingsFlow;
}) {
  const hiddenFields = useMemo(() => {
    return props.flow.ui.nodes.filter(
      (res) =>
        res.type === 'input' &&
        res.attributes.node_type === 'input' &&
        (res.attributes as UiNodeInputAttributes).type === 'hidden',
    );
  }, [props.flow]);

  return (
    <>
      {hiddenFields.map((value) => (
        <input
          key={(value.attributes as UiNodeInputAttributes).name}
          {...(value.attributes as UiNodeInputAttributes)}
        />
      ))}
    </>
  );
}
