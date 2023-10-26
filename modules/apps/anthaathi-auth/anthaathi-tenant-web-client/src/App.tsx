import { BaseProvider } from 'baseui';
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  useParams,
} from 'react-router-dom';
import { SnackbarProvider } from 'baseui/snackbar';
import { FormattedMessage, IntlProvider, useIntl } from 'react-intl';
import { Provider as StyletronProvider } from 'styletron-react';
import { RecoilRoot } from 'recoil';
import {
  AuthWrapper,
  DataSourceProvider,
  DefaultLayout,
  KratosContext,
  SidebarItemData,
  usePrefixedWithOrgMenu,
} from '@anthaathi/components';
import React, { Suspense } from 'react';
import { client, lightTheme } from './utils/styletron';
import { createEnvironment } from './relay-env';
import { graphql, loadQuery, RelayEnvironmentProvider } from 'react-relay';
import {
  ArrowLeft,
  Building,
  Dashboard,
  Group,
  User,
} from '@carbon/icons-react';
import { HomePage } from '@/pages/HomePage';
import { DashboardPage } from '@/pages/DashboardPage';
import UserPage from '@/pages/UserPage';
import { ManageOrganizationCreatePage } from '@/pages/ManageOrganizationCreatePage';
import { App_OrganizationCreateQuery } from '../__generated__/App_OrganizationCreateQuery.graphql';
import { App_UserListPageQuery } from '../__generated__/App_UserListPageQuery.graphql';
import { GroupPage } from '@/pages/GroupPage';
import { App_GroupListQuery } from '../__generated__/App_GroupListQuery.graphql';
import { App_NodePageQuery } from '../__generated__/App_NodePageQuery.graphql';
import { NodePage } from '@/pages/NodePage';
import { AppDataProvider } from '@/Common/DataProvider';

const relayEnv = createEnvironment();

const AppRoot = () => {
  const handleChange = usePrefixedWithOrgMenu();

  const intl = useIntl();

  const params = useParams<{ key: string }>();

  return (
    <DefaultLayout
      pageTitle="Anthaathi Admin"
      pageTitleTo={`/o/${params.key}`}
      items={handleChange([
        {
          label: intl.formatMessage({ defaultMessage: 'Dashboard' }),
          key: 'dashboard',
          to: '/',
          type: 'item',
          icon: <Dashboard />,
        },
        {
          type: 'accordion',
          key: 'directory',
          icon: <Building />,
          label: intl.formatMessage({ defaultMessage: 'Directory' }),
          items: [
            {
              label: intl.formatMessage({ defaultMessage: 'Users' }),
              key: 'user',
              to: '/user',
              type: 'item',
              icon: <User />,
            },
            {
              label: intl.formatMessage({ defaultMessage: 'Groups' }),
              key: 'group',
              to: '/group',
              type: 'item',
              icon: <Group />,
            },
          ],
        },
      ] as SidebarItemData[])}
    >
      <Suspense>
        <Outlet />
      </Suspense>
    </DefaultLayout>
  );
};

export const HomePageQuery = graphql`
  query App_HomePageQuery {
    ...OrganizationCardContainer
  }
`;

export const UserListPageQuery = graphql`
  query App_UserListPageQuery($org: String!) {
    ...UserList_container @arguments(org: $org)
  }
`;

export const OrganizationCreateQuery = graphql`
  query App_OrganizationCreateQuery($id: ID, $shouldGetTemplateData: Boolean!) {
    ...OrganizationTypeSelection_index
      @arguments(renderOrganizationTemplate: $shouldGetTemplateData, id: $id)
  }
`;

export const GroupListQuery = graphql`
  query App_GroupListQuery($orgKey: String!) {
    ...GroupList_list @arguments(orgKey: $orgKey)
  }
`;

export const NodePageQuery = graphql`
  query App_NodePageQuery(
    $id: ID!
    $orgKey: String!
    $shouldIncludeUser: Boolean!
  ) {
    node(id: $id) {
      id
      __typename

      ... on Group {
        title: name
      }
      ...GroupInfo_groupInfo
    }
    ...UserList_container
      @arguments(org: $orgKey, group: $id)
      @include(if: $shouldIncludeUser)
  }
`;

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    loader: () => {
      return loadQuery(relayEnv, HomePageQuery, {});
    },
  },
  {
    path: '/manage',
    element: (
      <DefaultLayout
        items={[]}
        pageTitleTo="/"
        pageTitle={
          <>
            <ArrowLeft
              size={14 as never}
              className={client.renderStyle({
                height: '100%',
                width: 'auto',
              })}
            />

            <span
              className={client.renderStyle({
                width: '12px',
                display: 'inline-block',
              })}
            />

            <FormattedMessage defaultMessage="Home"></FormattedMessage>
          </>
        }
      >
        <Outlet></Outlet>
      </DefaultLayout>
    ),
    children: [
      {
        path: '/manage/org/create',
        element: <ManageOrganizationCreatePage />,
        loader: (args) => {
          const url = new URL(args.request.url);

          const type = url.searchParams.get('type');

          return loadQuery<App_OrganizationCreateQuery>(
            relayEnv,
            OrganizationCreateQuery,
            {
              id: type,
              shouldGetTemplateData: Boolean(type),
            },
          );
        },
      },
    ],
  },
  {
    path: '/o/:key',
    element: <AppRoot />,
    children: [
      {
        path: '/o/:key',
        element: <DashboardPage />,
      },
      {
        path: '/o/:key/user',
        element: <UserPage />,
        loader: (args) => {
          return loadQuery<App_UserListPageQuery>(relayEnv, UserListPageQuery, {
            org: args.params.key!,
          });
        },
      },
      {
        path: '/o/:key/group',
        element: <GroupPage />,
        loader: (args) => {
          return loadQuery<App_GroupListQuery>(relayEnv, GroupListQuery, {
            orgKey: args.params.key!,
          });
        },
      },
      {
        path: '/o/:key/:typename/:id',
        element: <NodePage />,
        loader: (args) => {
          const shouldIncludeUsers = args.params.typename === 'group';

          return loadQuery<App_NodePageQuery>(relayEnv, NodePageQuery, {
            id: `gid://Anthaathi/${capitalizeFirstLetter(
              args.params.typename!,
            )}/${args.params.id}`,
            orgKey: args.params.key!,
            shouldIncludeUser: shouldIncludeUsers,
          });
        },
      },
    ],
  },
]);

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function App() {
  return (
    <IntlProvider locale="en">
      <RecoilRoot>
        <StyletronProvider value={client}>
          <BaseProvider theme={lightTheme} zIndex={1000}>
            <SnackbarProvider placement="bottom">
              <RelayEnvironmentProvider environment={relayEnv}>
                <DataSourceProvider dataSources={{}}>
                  <KratosContext.Provider
                    value={{
                      authBaseURL:
                        import.meta.env.VITE_APP_AUTH_BASE ??
                        'http://accounts.anthaathi.localhost:4443',
                    }}
                  >
                    <Suspense fallback={<>Loading</>}>
                      <AuthWrapper requireLogin={true} verificationRequired>
                        <AppDataProvider>
                          <RouterProvider router={router} />
                        </AppDataProvider>
                      </AuthWrapper>
                    </Suspense>
                  </KratosContext.Provider>
                </DataSourceProvider>
              </RelayEnvironmentProvider>
            </SnackbarProvider>
          </BaseProvider>
        </StyletronProvider>
      </RecoilRoot>
    </IntlProvider>
  );
}

export default App;
