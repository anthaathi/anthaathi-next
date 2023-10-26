import { create } from '@storybook/theming';
import { Provider as StyletronProvider } from 'styletron-react';
import { Client } from 'styletron-engine-atomic';
import { BaseProvider, createLightTheme } from 'baseui';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { KratosContext } from '../src/Features/Auth/context/KratosContext';

const theme = create({
  base: 'light',

  // Typography
  fontBase: '"IBM Plex Sans", "Noto Sans", sans-serif',
  fontCode: 'monospace',

  inputBorderRadius: 4,

  brandTitle: 'Anthaathi Kolhapur',
  brandUrl: 'https://anthaathi.org',
  brandImage: 'https://avatars.githubusercontent.com/u/99426700?s=56&v=4',
  brandTarget: '_self',
});

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  docs: {
    theme,
  },
};

const lightTheme = createLightTheme({
  primaryFontFamily: '"IBM Plex Sans", "Noto Sans", sans-serif',
}, {
  borders: {
    useRoundedCorners: true,
  }
});

const client = new Client({ prefix: '_' });

export const decorators = [
  (Story) => {
    const storyComponent = React.createElement(Story, {}, null);
    const base = React.createElement(
      React.Suspense,
      { fallback: 'Loading...' },
      storyComponent
    );
    const router = React.createElement(RouterProvider, {
      router: createBrowserRouter([{ element: base, path: '/*' }], {}),
    });
    const intlComponent = React.createElement(
      IntlProvider,
      {
        locale: 'en',
        messages: {},
      },
      router
    );
    const baseProvider = React.createElement(
      BaseProvider,
      { theme: lightTheme, zIndex: 100 },
      intlComponent
    );
    const recoilRoot = React.createElement(RecoilRoot, {}, baseProvider);
		const kratos = React.createElement(KratosContext.Provider, {
			value: {
				authBaseURL: ''
			}
		}, recoilRoot);

		console.log(kratos);

		return React.createElement(
      StyletronProvider,
      { value: client },
      kratos,
    );
  },
];
