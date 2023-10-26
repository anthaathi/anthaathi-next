import { TaskItem } from '@/features/Task/TaskItem';
import { graphql, usePaginationFragment } from 'react-relay';
import { TaskList_taskFragment$key } from '../../../../__generated__/TaskList_taskFragment.graphql';
import React from 'react';
import { Button } from 'baseui/button';
import { FormattedMessage, useIntl } from 'react-intl';
import { useStyletron } from 'baseui';
import { Block } from 'baseui/block';
import { BadgeList, BadgeListItem, BadgeSize } from '@anthaathi/components';

export interface TaskListProps {
  $key: TaskList_taskFragment$key;
  title?: React.ReactNode;
  extra?: React.ReactNode;
  onLoadMore?: () => void;
  includeKPI?: boolean;
}

export function TaskList(props: TaskListProps) {
  const {
    data: taskFragment,
    hasNext,
    loadNext,
  } = usePaginationFragment(
    graphql`
      fragment TaskList_taskFragment on Query
      @argumentDefinitions(
        first: { type: "Int", defaultValue: 10 }
        after: { type: "String" }
        customerId: { type: "ID" }
        customerGroupId: { type: "ID" }
        organization: { type: "ID!" }
        searchQuery: { type: "String" }
        key: { type: "String" }
        assignedTo: { type: "[ID!]" }
        templateId: { type: "[ID!]" }
        includeCompleted: { type: "Boolean" }
        showOnlyCompleted: { type: "Boolean" }
      )
      @refetchable(queryName: "TaskListPaginationQuery") {
        ...TaskStatus_taskStatuses @arguments(organization: $organization)

        tasks(
          query: $searchQuery
          first: $first
          after: $after
          customerGroupId: $customerGroupId
          customerId: $customerId
          organization: $organization
          assignedTo: $assignedTo
          templateId: $templateId
          includeCompleted: $includeCompleted
          showOnlyCompleted: $showOnlyCompleted
					templateKey: $key
        ) @connection(key: "TaskList_tasks") {
          totalCount
          edges {
            node {
              # TODO: Optimize this one
              id
              title
              customer {
                firstName
                lastName
              }
              data
              ...TaskItem_taskItem
            }
          }
        }
      }
    `,
    props.$key
  );

  const [css] = useStyletron();

  const addFilter = (
    <>
      <span
        className={css({
          marginLeft: '4px',
        })}
      />

      <Button size="compact" kind="secondary" disabled>
        <FormattedMessage defaultMessage="Add filter" />
      </Button>
    </>
  );

  const intl = useIntl();

  return (
    <>
      {props.includeKPI && (
        <div
          className={css({
            marginTop: '12px',
          })}
        >
          <BadgeList $size={BadgeSize.SMALL}>
            <BadgeListItem
              title={intl.formatMessage({ defaultMessage: 'Open tasks' })}
            >
              {taskFragment.tasks.totalCount}
            </BadgeListItem>
          </BadgeList>
        </div>
      )}

      {props.title ? (
        <div
          className={css({
            display: 'flex',
            alignItems: 'center',
            padding: '12px 0',
          })}
        >
          {props.title}
          <span
            className={css({
              flexGrow: 1,
            })}
          />
          {addFilter}
          {props.extra}
        </div>
      ) : (
        <div
          className={css({
            padding: '12px 0',
            display: 'flex',
            alignItems: 'center',
          })}
        >
          {addFilter}
          {props.extra}
        </div>
      )}

      <div
        className={css({
          display: 'table',
          width: '100%',
        })}
      >
        {taskFragment.tasks.edges.map((res, index) => (
          <TaskItem
            key={res?.node.id ?? index}
            $key={res?.node!}
            $statusKey={taskFragment}
          />
        ))}
      </div>

      {hasNext && (
        <Block paddingTop="scale400" paddingRight="scale600">
          <Button
            size="compact"
            kind="secondary"
            onClick={() => {
              loadNext(10);
              props.onLoadMore?.();
            }}
          >
            <FormattedMessage defaultMessage="Load more" />
          </Button>
        </Block>
      )}
    </>
  );
}
