'use client';
/*
 * Copyright (c) Anthaathi Private Limited 2023.
 *
 * This code is the exclusive property of Anthaathi Private Limited and is protected by copyright and intellectual property laws.
 * Any unauthorized use, reproduction, distribution, or modification of this code is strictly prohibited.
 *
 * Anthaathi Private Limited reserves all rights in and to this code and will vigorously defend its intellectual property rights.
 */

import { useStyletron } from 'baseui';
import React from 'react';

export interface DividerWithTextProps {
  children: React.ReactNode;
}

export function DividerWithText(props: DividerWithTextProps) {
  const [css, $theme] = useStyletron();

  return (
    <div
      className={css({
        marginLeft: `-${$theme.sizing.scale800}`,
        marginRight: `-${$theme.sizing.scale800}`,
        marginTop: $theme.sizing.scale800,
        ...$theme.typography.LabelMedium,
        position: 'relative',
        textAlign: 'center',
        '::after': {
          content: "''",
          height: '1px',
          width: '45%',
          position: 'absolute',
          left: 0,
          top: '50%',
          backgroundColor: '#EEE',
        },
        '::before': {
          content: "''",
          height: '1px',
          width: '45%',
          top: '50%',
          position: 'absolute',
          right: 0,
          backgroundColor: '#EEE',
        },
      })}
    >
      {props.children}
    </div>
  );
}
