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
  UiNode,
  UiNodeImageAttributes,
  UiNodeInputAttributes,
  UiNodeTextAttributes,
  VerificationFlow,
} from '@ory/kratos-client';
import { FormControl } from 'baseui/form-control';
import { Input } from 'baseui/input';
import { useMemo, useState } from 'react';
import { Cell, Grid, Responsive } from 'baseui/layout-grid';
import { LabelMedium } from 'baseui/typography';
import { Button } from 'baseui/button';

export const FORM_LABELS: Record<
  string,
  {
    priority?: number;
    override?: { colSpan?: Responsive<number>; name?: string };
  }
> = {
  'traits.firstName': {
    priority: 1,
    override: {
      colSpan: [12, 12, 12],
    },
  },
  'traits.lastName': {
    priority: 2,
    override: {
      colSpan: [12, 12, 12],
    },
  },
  'traits.email': {
    priority: 3,
  },
  password: {
    priority: 4,
  },
  identifier: {
    override: {
      name: 'Email / Username',
    },
  },
};

export interface OktaInputRendererProps {
  nodes?: UiNode[];
  /**
   * @deprecated
   */
  flow?:
    | LoginFlow
    | RegistrationFlow
    | RecoveryFlow
    | VerificationFlow
    | SettingsFlow;
  includeSubmit?: boolean;
  disableAutoFocus?: boolean;
}

export function OktaInputRenderer(props: OktaInputRendererProps) {
  const [formState, setFormState] = useState<Record<string, string>>({});

  const flowItems = useMemo(() => {
    const returnValue = (props.nodes ?? props.flow?.ui.nodes)!.filter((res) => {
      if (props.includeSubmit) {
        return (res.attributes as UiNodeInputAttributes).type !== 'hidden';
      }

      return (
        res.type === 'input' &&
        res.attributes.node_type === 'input' &&
        (res.attributes as UiNodeInputAttributes).type !== 'hidden' &&
        (res.attributes as UiNodeInputAttributes).type !== 'submit'
      );
    });

    if (props.includeSubmit) {
      return returnValue;
    }

    return returnValue.sort((v1, v2) => {
      const v1Priority =
        FORM_LABELS[(v1.attributes as UiNodeInputAttributes).name]?.priority ||
        0;

      const v2Priority =
        FORM_LABELS[(v2.attributes as UiNodeInputAttributes).name]?.priority ||
        0;

      return v1Priority - v2Priority;
    });
  }, [props.flow?.ui.nodes, props.includeSubmit, props.nodes]);

  return (
    <Grid gridMaxWidth={0} gridMargins={0}>
      {flowItems.map((node, index) => {
        const { value, ...rest } = node.attributes as UiNodeInputAttributes;

        const name = (node.attributes as UiNodeInputAttributes).name;

        const firstMessage = node.messages?.[0];

        let child: React.ReactNode = null;

        switch (node.type) {
          case 'input':
            const attributes3 = node.attributes as UiNodeInputAttributes;

            if (attributes3.type === 'submit') {
              child = (
                <FormControl>
                  <Button kind="secondary" {...(attributes3 as object)}>
                    {node.meta?.label?.text}
                  </Button>
                </FormControl>
              );
              break;
            }

            child = (
              <FormControl
                label={
                  FORM_LABELS[name]?.override?.name ?? node.meta.label?.text
                }
                positive={
                  firstMessage?.type === 'success' ? firstMessage?.text : null
                }
                caption={
                  firstMessage?.type === 'info' ? firstMessage?.text : null
                }
                error={
                  firstMessage?.type === 'error' ? firstMessage?.text : null
                }
                htmlFor={name ?? index}
              >
                <Input
                  value={formState[name] ?? value ?? ''}
                  id={name ?? index}
                  autoFocus={index === 0 && !props.disableAutoFocus}
                  onChange={(e) => {
                    if (name) {
                      setFormState((prev) => ({
                        ...prev,
                        [name]: e.target.value,
                      }));
                    }
                  }}
                  placeholder={
                    FORM_LABELS[name]?.override?.name ?? node.meta.label?.text
                  }
                  {...(typeof window === 'undefined' ? node.attributes : rest)}
                />
              </FormControl>
            );
            break;
          case 'img':
            const attributes1 = node.attributes as UiNodeImageAttributes;
            // eslint-disable-next-line @next/next/no-img-element
            child = <img alt={attributes1.node_type ?? ''} {...attributes1} />;
            break;
          case 'text':
            const attributes = node.attributes as UiNodeTextAttributes;

            child = (
              <LabelMedium id={attributes.id}>
                {attributes.text.text}
              </LabelMedium>
            );
            break;
        }

        return (
          <Cell span={FORM_LABELS[name]?.override?.colSpan ?? 12} key={index}>
            {child}
          </Cell>
        );
      })}
    </Grid>
  );
}
