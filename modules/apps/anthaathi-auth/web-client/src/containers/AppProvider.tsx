'use client';
import {
  Client as Styletron,
  Server as StyletronServer,
} from 'styletron-engine-atomic';
import { Provider as StyletronProvider } from 'styletron-react';
import React from 'react';
import { BaseProvider, createLightTheme } from 'baseui';
import { useServerInsertedHTML } from 'next/navigation';
import { IntlProvider } from 'react-intl';

const engine =
  typeof window === 'undefined'
    ? new StyletronServer({
        prefix: '_',
      })
    : new Styletron({
        hydrate: document.getElementsByClassName('__styletron') as never,
        prefix: '_',
      });

const lightTheme = createLightTheme({
  primaryFontFamily: 'mundial, sans-serif',
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  useServerInsertedHTML(() => {
    return (
      <>
        <style
          dangerouslySetInnerHTML={{
            __html: 'body, html { padding: 0; margin: 0; height: 100% }',
          }}
        />
        <link rel="stylesheet" href="https://use.typekit.net/rex6ldp.css" />
        {(engine as StyletronServer).getStylesheets().map((res, key) => (
          <style
            key={key}
            className="__styletron"
            dangerouslySetInnerHTML={{ __html: res.css }}
            {...res.attrs}
          />
        ))}
      </>
    );
  });

  return (
    <IntlProvider locale="en">
      <StyletronProvider value={engine}>
        <BaseProvider
          zIndex={100}
          overrides={{
            AppContainer: {
              style: {
                height: '100%',
              },
            },
          }}
          theme={lightTheme}
        >
          {children}
        </BaseProvider>
      </StyletronProvider>
    </IntlProvider>
  );
}
