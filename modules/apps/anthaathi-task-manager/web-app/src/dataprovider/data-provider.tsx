import React, { useCallback } from 'react';
import {
  DataSourceProvider,
  GlobalSearchDataSource,
} from '@anthaathi/components';
import { fetchQuery, graphql, useRelayEnvironment } from 'react-relay';
import { dataProviderSearchQuery } from '../../__generated__/dataProviderSearchQuery.graphql';
import { useOrganizationContext } from '@/hooks/use-organization-id';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { taskSidebarAtom } from '@/features/Task/TaskSidebar/atom';
import { DocumentTasks, User } from '@carbon/icons-react';
import { useStyletron } from 'styletron-react';
import { useIntl } from 'react-intl';

const searchQuery = graphql`
  query dataProviderSearchQuery($search: String!, $organizationId: ID!) {
    globalSearch(query: $search, organizationId: $organizationId) {
      edges {
        node {
          label
          id
          entityId
        }
      }
    }
  }
`;

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const env = useRelayEnvironment();

  const org = useOrganizationContext();

  const navigate = useNavigate();

  const [, setTaskSidebar] = useRecoilState(taskSidebarAtom);

  const [css] = useStyletron();

  const intl = useIntl();

  const search: GlobalSearchDataSource = useCallback(
    async ({ search }) => {
      const result = await fetchQuery<dataProviderSearchQuery>(
        env,
        searchQuery,
        {
          search,
          organizationId: org?.organizationByKey?.id!,
        },
        {
          fetchPolicy: 'store-or-network',
        }
      ).toPromise();

      return {
        items:
          result?.globalSearch.edges.map((res) => {
            const entityId = res?.node.entityId?.split('/');

            const type = entityId?.[3]!;
            const value = entityId?.[4]!;

            let icon = null;

            switch (type) {
              case 'Task':
                icon = <DocumentTasks />;
                break;
              case 'UserCore':
                icon = <User />;
            }

            return {
              label: (
                <div
                  className={css({
                    display: 'flex',
                    alignItems: 'center',
                  })}
                >
                  {icon && (
                    <>
                      {icon}
                      <span
                        className={css({
                          width: '12px',
                          display: 'block',
                        })}
                      ></span>
                    </>
                  )}
                  {type === 'UserCore'
                    ? intl.formatMessage(
                        {
                          defaultMessage: 'Show tasks assigned to {label}',
                        },
                        {
                          label: res?.node.label!,
                        }
                      )
                    : res?.node.label!}
                </div>
              ) as never as string,
              id: res?.node.id!,
              onClick: () => {
                switch (type) {
                  case 'Task':
                    setTaskSidebar(res?.node?.entityId!);
                    break;
                  case 'UserCore':
                    navigate(
                      `/o/${
                        org?.organizationByKey?.key
                      }/tasks?assigned=${encodeURIComponent(value)}`
                    );
                }
              },
            };
          }) ?? [],
        total: result?.globalSearch.edges.length!,
      };
    },
    [org, env, navigate, setTaskSidebar, css, intl]
  );

  return (
    <DataSourceProvider
      dataSources={{
        search,
      }}
    >
      {children}
    </DataSourceProvider>
  );
}
