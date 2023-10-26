import { NewTaskButton } from '@/features/Task/NewTaskButton';
import { TaskList } from '@/features/Task/TaskList';
import { TaskTemplateSelector } from '@/features/Task/TaskTemplateSelector';
import { useOrganizationContext } from '@/hooks/use-organization-id';
import { ContentWrapper, useSession } from '@anthaathi/components';
import { HeadingSmall } from 'baseui/typography';
import { useEffect, useMemo, useReducer, useRef } from 'react';
import { useIntl } from 'react-intl';
import { graphql, useLazyLoadQuery } from 'react-relay';
import { useSearchParams } from 'react-router-dom';
import { TaskListQuery } from '../../../__generated__/TaskListQuery.graphql';

export default function TaskListPage() {
  const intl = useIntl();

  const [searchParams, setSearchParams] = useSearchParams();

  const currentUser = useSession();

  const assignedTo = searchParams.getAll('assigned');
  const template = searchParams.getAll('template');
  const templateKey = searchParams.get('key');

  const currentUserId = currentUser?.identity.id!;

  const isAssignedToSelf = useMemo(() => {
    return currentUserId ? assignedTo.includes(currentUserId) : false;
  }, [assignedTo, currentUserId]);

  const organization = useOrganizationContext();

  const [fetchKey, setFetchKey] = useReducer((prev) => prev + 1, 0);

  const isCompleted = searchParams.get('completed') === 'true';

  const taskListQuery = useLazyLoadQuery<TaskListQuery>(
    graphql`
      query TaskListQuery(
        $organization: ID!
        $assignedTo: [ID!]
        $template: [ID!]
        $showOnlyCompleted: Boolean,
				$key: String,
      ) {
        ...TaskTemplateSelector_taskTemplates
          @arguments(organization: $organization)

        ...TaskList_taskFragment
          @arguments(
            organization: $organization
            assignedTo: $assignedTo
            templateId: $template
            showOnlyCompleted: $showOnlyCompleted
						key: $key
          )
      }
    `,
    {
      organization: organization?.organizationByKey?.id!,
      assignedTo:
        assignedTo.length !== 0
          ? assignedTo.map((id) => `gid://Anthaathi/UserCore/${id}`)
          : undefined,
      template:
        template.length !== 0
          ? template.map((id) => `gid://Anthaathi/TaskTemplate/${id}`)
          : undefined,
      showOnlyCompleted: isCompleted,
			key: templateKey ?? undefined,
    },
    {
      fetchPolicy: 'store-and-network',
      fetchKey: fetchKey,
    }
  );

  const key = useRef<number>();

  const hasLoadMore = useRef(false);

  useEffect(() => {
    key.current = setInterval(() => {
      if (document.visibilityState === 'visible') {
        setFetchKey();
      }
      // TODO: Lower this when persistent queries are implmeneted
    }, 1_000 * 30);

    return () => {
      if (key.current) {
        clearInterval(key.current);
      }
    };
  }, [setFetchKey]);

  return (
    <ContentWrapper
      title={intl.formatMessage({ defaultMessage: 'Tasks' })}
      breadcrumb={[
        {
          title: intl.formatMessage({ defaultMessage: 'Anthaathi Tasks' }),
        },
      ]}
      toolbarTab={[
        {
          title: intl.formatMessage({ defaultMessage: 'Overview' }),
          isActive: !isAssignedToSelf && !isCompleted,
          onClick: () => {
            setSearchParams((prev) => {
              prev.delete('assigned');

              prev
                .getAll('assigned')
                .filter((id) => id !== currentUserId)
                .forEach((id) => {
                  prev.append('assigned', id);
                });

              prev.delete('completed');

              return prev;
            });
          },
        },
        {
          title: intl.formatMessage({ defaultMessage: 'My tasks' }),
          isActive: isAssignedToSelf && !isCompleted,
          onClick: () => {
            setSearchParams((prev) => {
              prev.delete('assigned');
              prev.append('assigned', currentUserId);

              prev.delete('completed');

              return prev;
            });
          },
        },
        {
          title: intl.formatMessage({ defaultMessage: 'Completed tasks' }),
          isActive: isCompleted,
          onClick: () => {
            setSearchParams((prev) => {
              prev.delete('assigned');
              prev.delete('completed');

              prev.append('completed', 'true');

              return prev;
            });
          },
        },
      ]}
    >
      <TaskTemplateSelector $key={taskListQuery} />

      <TaskList
        $key={taskListQuery}
        onLoadMore={() => {
          key.current && clearTimeout(key.current);
          hasLoadMore.current = true;
        }}
        title={
          <HeadingSmall marginBottom="0" marginTop="0">
            {intl.formatMessage({ defaultMessage: 'Tasks' })}
          </HeadingSmall>
        }
      />

      <NewTaskButton />
    </ContentWrapper>
  );
}
