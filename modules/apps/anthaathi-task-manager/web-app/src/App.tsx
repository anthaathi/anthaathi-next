import {
  createBrowserRouter,
  Outlet,
  redirect,
  RouterProvider,
} from 'react-router-dom';
import {
  AuthWrapper,
  DataSourceProvider,
  DefaultLayout,
  KratosContext,
  Lang,
  SessionInfo,
  SidebarItemData,
  useSession,
} from '@anthaathi/components';
import React, { Suspense } from 'react';
import { BaseProvider, createLightTheme } from 'baseui';
import { SnackbarProvider } from 'baseui/snackbar';
import { FormattedMessage, IntlProvider } from 'react-intl';
import { RecoilRoot } from 'recoil';
import { Provider as StyletronProvider } from 'styletron-react';
import { styletronClient } from '@/utils/style-client';
import {
  DocumentTasks,
  Group,
  Home,
  Language,
  User,
  UserAccess,
  UserActivity,
} from '@carbon/icons-react';
import { RelayEnvironmentProvider } from 'react-relay';
import { createEnvironment } from '@/relay-env';
import {
  OrganizationContext,
  useOrganizationInfo,
} from '@/hooks/use-organization-id';
import TaskSidebar from '@/features/Task/TaskSidebar';
import { HeadingXSmall } from 'baseui/typography';
import { Block } from 'baseui/block';
import MrLang from './intl/mr.json';
import EnLang from './intl/en.json';
import { AppDataProvider } from '@/dataprovider/data-provider';

const lightTheme = createLightTheme({
  primaryFontFamily: "mundial, 'Noto Sans', sans-serif",
});

const HomePage = React.lazy(() => import('./pages/Home'));
const CustomerPage = React.lazy(() => import('./pages/Customer'));
const CustomerInfoPage = React.lazy(() => import('./pages/CustomerInfo'));
const CustomerGroupPage = React.lazy(() => import('./pages/CustomerGroup'));
const CustomerGroupInfoPage = React.lazy(
  () => import('./pages/CustomerGroupInfo'),
);
const CustomerGroupInfoTabOverviewPage = React.lazy(
  () => import('./pages/CustomerGroupInfoTabOverview'),
);
const CustomerGroupInfoTabCustomerPage = React.lazy(
  () => import('./pages/CustomerGroupInfoTabCustomer'),
);
const TaskListPage = React.lazy(() => import('./pages/TaskList'));
const TaskTemplatePage = React.lazy(
  () => import('./pages/Reporting/TaskTemplateWise'),
);
const FeedbackPage = React.lazy(() => import('./pages/Feedback'));
const UserListPage = React.lazy(() => import('./pages/UserList'));
const UserInfoPage = React.lazy(() => import('./pages/UserInfo'));

const OrganizationData = ({ children }: { children: React.ReactNode }) => {
  const value = useOrganizationInfo();
  const session = useSession();

  if (!value.organizationByKey) {
    return (
      <Block alignItems="center" placeContent="center" display="flex">
        <HeadingXSmall
          $style={{
            textAlign: 'center',
          }}
        >
          <FormattedMessage
            defaultMessage="This organization does not exists or you don't have access to the organization.{br}Your UserID is {value}"
            values={{
              br: (
                <>
                  <br />
                </>
              ),
              value: session?.identity.id,
            }}
          />
        </HeadingXSmall>
      </Block>
    );
  }

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
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
    path: '/o/:orgId',
    element: (
      <AuthWrapper useKratosUrl={true} requireLogin={true}>
        <OrganizationData>
          <OrganizationContext.Consumer>
            {(org) => {
              return (
                <AppDataProvider>
                  <TaskSidebar />

                  <SessionInfo.Consumer>
                    {(value) => {
                      return (
                        <DefaultLayout
                          items={
                            ((
                              [
                                {
                                  label: (
                                    <FormattedMessage defaultMessage="Home" />
                                  ),
                                  type: 'item',
                                  key: 'home',
                                  icon: <Home />,
                                  to: '/',
                                },
                                {
                                  label: (
                                    <FormattedMessage defaultMessage="Tasks" />
                                  ),
                                  type: 'section',
                                  key: 'task-section',
                                },
                                {
                                  label: (
                                    <FormattedMessage defaultMessage="My tasks" />
                                  ),
                                  type: 'item',
                                  key: 'my-tasks',
                                  icon: <UserActivity />,
                                  to: '/tasks?assigned=' + value?.identity.id,
                                },
                                {
                                  label: (
                                    <FormattedMessage defaultMessage="Tasks" />
                                  ),
                                  type: 'item',
                                  key: 'tasks',
                                  icon: <DocumentTasks />,
                                  // TODO: Fix for current menu this should be handled in anthaathi components
                                  to: '/tasks?current-menu=true',
                                },
                                {
                                  label: (
                                    <FormattedMessage defaultMessage="Customers" />
                                  ),
                                  type: 'section',
                                  key: 'customer-section',
                                },
                                {
                                  label: (
                                    <FormattedMessage defaultMessage="All Customers" />
                                  ),
                                  type: 'item',
                                  key: 'customers',
                                  icon: <User />,
                                  to: '/customer',
                                },
                                {
                                  label: (
                                    <FormattedMessage defaultMessage="Groups" />
                                  ),
                                  type: 'item',
                                  key: 'customer-group',
                                  icon: <Group />,
                                  to: '/customer-groups',
                                },
                                {
                                  label: (
                                    <FormattedMessage defaultMessage="Organization" />
                                  ),
                                  key: 'organization',
                                  type: 'section',
                                },
                                {
                                  label: (
                                    <FormattedMessage defaultMessage="User" />
                                  ),
                                  key: 'users',
                                  icon: <UserAccess />,
                                  type: 'item',
                                  to: '/users',
                                },
                                {
                                  label: (
                                    <FormattedMessage defaultMessage="Reporting" />
                                  ),
                                  type: 'section',
                                  key: 'reporting',
                                },
                                {
                                  label: (
                                    <FormattedMessage defaultMessage="Reporting" />
                                  ),
                                  type: 'item',
                                  key: 'reporting-task-template-wise',
                                  icon: <DocumentTasks />,
                                  to: `${
                                    import.meta.env.VITE_APP_REPORTING_URL ??
                                    'https://dash.syncws.com/dashboards'
                                  }`,
                                },
                                {
                                  type: 'spacer',
                                },
                                {
                                  label: (
                                    <Block display="flex" alignItems="center">
                                      <Language />
                                      <Block marginRight="12px" />
                                      <FormattedMessage defaultMessage="Language" />
                                    </Block>
                                  ),
                                  type: 'accordion',
                                  key: 'change-language',
                                  items: [
                                    {
                                      label: 'English',
                                      type: 'item',
                                      key: 'en',
                                      onClick: () => {
                                        localStorage.setItem('user-lang', 'en');
                                        window.location.reload();
                                      },
                                    },
                                    {
                                      label: 'मराठी',
                                      type: 'item',
                                      key: 'mr',
                                      onClick: () => {
                                        localStorage.setItem('user-lang', 'mr');
                                        window.location.reload();
                                      },
                                    },
                                  ],
                                },
                              ] as SidebarItemData[]
                            ).map((res) => {
                              if (res.to?.startsWith('https://') || !res.to) {
                                return res;
                              }

                              return {
                                ...res,
                                to: `/o/${org?.organizationByKey?.key}${res.to}`,
                              };
                            }) ?? []) as SidebarItemData[]
                          }
                          pageTitleTo={`/o/${org?.organizationByKey?.key}/`}
                          pageTitle={
                            <FormattedMessage defaultMessage="Task | Anthaathi" />
                          }
                        >
                          <Outlet />
                        </DefaultLayout>
                      );
                    }}
                  </SessionInfo.Consumer>
                </AppDataProvider>
              );
            }}
          </OrganizationContext.Consumer>
        </OrganizationData>
      </AuthWrapper>
    ),
    children: [
      {
        path: '/o/:orgId/',
        element: (
          <Suspense>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: '/o/:orgId/tasks',
        element: (
          <Suspense fallback={<></>}>
            <TaskListPage />
          </Suspense>
        ),
      },
      {
        path: '/o/:orgId/customer',
        element: (
          <Suspense>
            <CustomerPage />
          </Suspense>
        ),
      },
      {
        path: '/o/:orgId/customer/:id',
        element: (
          <Suspense>
            <CustomerInfoPage />
          </Suspense>
        ),
      },
      {
        path: '/o/:orgId/customer-groups',
        element: (
          <Suspense>
            <CustomerGroupPage />
          </Suspense>
        ),
      },
      {
        path: '/o/:orgId/users',
        element: (
          <Suspense>
            <UserListPage />
          </Suspense>
        ),
      },
      {
        path: '/o/:orgId/user/:id',
        element: (
          <Suspense>
            <UserInfoPage />
          </Suspense>
        ),
      },
      {
        path: '/o/:orgId/customer-groups/:id',
        element: (
          <Suspense>
            <CustomerGroupInfoPage />
          </Suspense>
        ),
        children: [
          {
            path: '/o/:orgId/customer-groups/:id',
            element: (
              <Suspense>
                <CustomerGroupInfoTabOverviewPage />
              </Suspense>
            ),
          },
          {
            path: '/o/:orgId/customer-groups/:id/customer',
            element: (
              <Suspense>
                <CustomerGroupInfoTabCustomerPage />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: '/o/:orgId/reporting/task-template-wise',
        element: (
          <Suspense>
            <TaskTemplatePage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: '/feedback/:id',
    element: (
      <>
        <FeedbackPage />
      </>
    ),
  },
]);

const env = createEnvironment();

const URL = import.meta.env.VITE_ORY_SDK_URL;

const DEFAULT_URL =
  typeof window === 'undefined'
    ? 'http://localhost:4433'
    : 'http://accounts.anthaathi.localhost:4443';

const langMessages: Record<string, Record<string, string>> = {
  mr: { ...MrLang, ...Lang['mr'] },
  en: { ...EnLang, ...Lang['en'] },
};

export default function App({ language }: { language?: string }) {
  const defaultLanguage = language ?? navigator.language;

  return (
    <React.StrictMode>
      <RelayEnvironmentProvider environment={env}>
        <RecoilRoot>
          <DataSourceProvider dataSources={{}}>
            <IntlProvider
              locale={defaultLanguage}
              messages={langMessages[defaultLanguage.split('-')[0]]}
            >
              <StyletronProvider value={styletronClient}>
                <BaseProvider theme={lightTheme} zIndex={1000}>
                  {import.meta.env.DEV && (
                    <div
                      className={styletronClient.renderStyle({
                        position: 'fixed',
                        zIndex: 99999999,
                        top: '12px',
                        right: '15%',
                        background: 'red',
                        padding: '12px',
                        userSelect: 'none',
                        pointerEvents: 'none',
                        fontFamily: 'monospace',
                        opacity: 0.8,
                        color: 'white',
                      })}
                    >
                      DEV MODE
                    </div>
                  )}
                  <SnackbarProvider>
                    <KratosContext.Provider
                      value={{
                        authBaseURL: URL ?? DEFAULT_URL,
                      }}
                    >
                      <Suspense>
                        <RouterProvider router={router} />
                      </Suspense>
                    </KratosContext.Provider>
                  </SnackbarProvider>
                </BaseProvider>
              </StyletronProvider>
            </IntlProvider>
          </DataSourceProvider>
        </RecoilRoot>
      </RelayEnvironmentProvider>
    </React.StrictMode>
  );
}
