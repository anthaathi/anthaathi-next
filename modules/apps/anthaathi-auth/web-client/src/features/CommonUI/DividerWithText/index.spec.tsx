/*
 * Copyright (c) Anthaathi Private Limited 2023.
 *
 * This code is the exclusive property of Anthaathi Private Limited and is protected by copyright and intellectual property laws.
 * Any unauthorized use, reproduction, distribution, or modification of this code is strictly prohibited.
 *
 * Anthaathi Private Limited reserves all rights in and to this code and will vigorously defend its intellectual property rights.
 */
import * as React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DividerWithText } from './index';

describe('DividerWithText', function () {
  it('should render', () => {
    const { getByText } = render(
      <DividerWithText>Hello world</DividerWithText>,
    );

    expect(getByText('Hello world')).toBeTruthy();
  });
});
