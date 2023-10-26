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
  RegistrationFlow,
  UiNodeInputAttributes,
} from '@ory/kratos-client';
import { Button, KIND } from 'baseui/button';
import { OktaCommonFieldRenderer } from '../CommonField';
import React, { useState } from 'react';
import { useStyletron } from 'baseui';

export function OIDCRenderer(props: { flow: LoginFlow | RegistrationFlow }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [css] = useStyletron();

  return (
    <>
      <form
        action={props.flow!.ui.action}
        method={props.flow.ui.method}
        onSubmit={() => {
          setIsSubmitting(true);
        }}
        className={css({
          display: 'flex',
          flexWrap: 'wrap',
          placeContent: 'center',
          gap: '12px',
        })}
      >
        <OktaCommonFieldRenderer flow={props.flow} />
        {props.flow.ui.nodes
          .filter((res) => res.group === 'oidc')
          .map((node) => {
            const attributes = node.attributes as UiNodeInputAttributes;

            return (
              <Button
                key={attributes.value}
                value={attributes.value}
                name={attributes.name}
                disabled={attributes.disabled}
                kind={KIND.secondary}
                isLoading={isSubmitting}
              >
                {Logos[attributes.value]}
                <span className={css({ width: '12px' })} />
                {node.meta.label?.text}
              </Button>
            );
          })}
      </form>
    </>
  );
}

const Logos: Record<string, JSX.Element> = {
  google: (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width="16px"
      height="16px"
      viewBox="0 0 48 48"
    >
      <g>
        <path
          fill="#EA4335"
          d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
        />
        <path
          fill="#4285F4"
          d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
        />
        <path
          fill="#FBBC05"
          d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
        />
        <path
          fill="#34A853"
          d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
        />
        <path fill="none" d="M0 0h48v48H0z" />
      </g>
    </svg>
  ),
};
