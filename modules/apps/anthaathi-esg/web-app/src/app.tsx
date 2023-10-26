import {
  AuthWrapper,
  DataSourceProvider,
  DefaultLayout,
  KratosContext,
} from '@anthaathi/components';
import React, { Suspense } from 'react';
import { RecoilRoot } from 'recoil';
import { FormattedMessage, IntlProvider } from 'react-intl';
import { RelayEnvironmentProvider } from 'react-relay';
import { relayEnv } from '@/relay-env';
import { Provider as StyletronProvider } from 'styletron-react';
import { lightTheme, styletronClient } from '@/utils/style-client';
import { BaseProvider } from 'baseui';
import {
  createBrowserRouter,
  Outlet,
  redirect,
  RouterProvider,
} from 'react-router-dom';
import { useSidebarItems } from '@/consts/navigation';
import { NodePage } from '@/pages/Node';
import { StyledNotificationCircle } from 'baseui/badge';

const OrderPage = React.lazy(() => import('./pages/Order'));

const AppRoot = () => {
  const sidebarItems = useSidebarItems();

  return (
    <DefaultLayout
      items={sidebarItems}
      pageTitle={<FormattedMessage defaultMessage="ESG | Anthaathi" />}
    >
      <Suspense fallback={<StyledNotificationCircle />}>
        <Outlet />
      </Suspense>
    </DefaultLayout>
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    loader: () => {
      throw redirect(
        `http://tenant.anthaathi.localhost:4443/?redirect-url=${encodeURIComponent(
          // eslint-disable-next-line no-restricted-globals
          location.href,
        )}`,
      );
    },
  },
  {
    path: '/o/:orgKey',
    element: <AppRoot />,
    children: [
      {
        path: '/o/:orgKey/order',
        element: <OrderPage />,
      },
      {
        path: '/o/:orgKey/:typename/:id',
        element: <NodePage />,
      },
    ],
  },
]);

export function App() {
  return (
    <RecoilRoot>
      <RelayEnvironmentProvider environment={relayEnv}>
        <IntlProvider locale="en">
          <DataSourceProvider dataSources={{}}>
            <StyletronProvider value={styletronClient}>
              <BaseProvider theme={lightTheme} zIndex={1000}>
                <KratosContext.Provider
                  value={{
                    authBaseURL: 'http://auth.anthaathi.localhost:4443',
                  }}
                >
                  <AuthWrapper>
                    <RouterProvider router={router} />
                  </AuthWrapper>
                </KratosContext.Provider>
              </BaseProvider>
            </StyletronProvider>
          </DataSourceProvider>
        </IntlProvider>
      </RelayEnvironmentProvider>
    </RecoilRoot>
  );
}
