import {
  graphql,
  useFragment,
  useMutation,
  usePaginationFragment,
} from 'react-relay';
import { StatefulMenu } from 'baseui/menu';
import { Button, CustomColors } from 'baseui/button';
import { StatefulPopover } from 'baseui/popover';
import { TaskStatus_taskItem$key } from '../../../../__generated__/TaskStatus_taskItem.graphql';
import { TaskStatus_taskStatuses$key } from '../../../../__generated__/TaskStatus_taskStatuses.graphql';
import { TaskStatusChangeStatusMutation } from '../../../../__generated__/TaskStatusChangeStatusMutation.graphql';
import React, { useMemo } from 'react';
import { DataShare } from '@carbon/icons-react';
import { useStyletron } from 'baseui';

export interface TaskStatusProps {
  $key: TaskStatus_taskItem$key;
  $statusKey: TaskStatus_taskStatuses$key;
  $isFull?: boolean
}

export function TaskStatus(props: TaskStatusProps) {
  const taskItem = useFragment(
    graphql`
      fragment TaskStatus_taskItem on Task {
        id
        status {
          id
          name
          systemStatus
        }
      }
    `,
    props.$key
  );

  const { data: taskStatuses } = usePaginationFragment(
    graphql`
      fragment TaskStatus_taskStatuses on Query
      @argumentDefinitions(
        first: { type: "Int", defaultValue: 10 }
        after: { type: "String" }
        organization: { type: "ID!" }
      )
      @refetchable(queryName: "TaskItemTaskStatusesPaginationQuery") {
        taskStatuses(first: $first, after: $after, organization: $organization)
          @connection(key: "TaskItem_taskStatuses") {
          edges {
            node {
              id
              name
              description
            }
          }
        }
      }
    `,
    props.$statusKey
  );

  const [changeStatus] = useMutation<TaskStatusChangeStatusMutation>(
    graphql`
      mutation TaskStatusChangeStatusMutation($input: ChangeTaskStatusInput!) {
        changeTaskStatus(input: $input) {
          task {
            ...TaskItem_taskItem
          }
        }
      }
    `
  );

  const [css, $theme] = useStyletron();

  const customColor: CustomColors | undefined = useMemo(() => {
    switch (taskItem.status?.systemStatus) {
      case 'Done':
        return {
          backgroundColor: $theme.colors.positive400,
          color: $theme.colors.contentOnColor,
        };
      case 'InProgress':
        return {
          backgroundColor: $theme.colors.warning300,
          color: $theme.colors.contentPrimary,
        };

      case 'Blocked':
        return {
          backgroundColor: $theme.colors.negative200,
          color: $theme.colors.contentOnColor,
        };
      case 'Pending':
        return {
          backgroundColor: '#777' ?? $theme.colors.backgroundSecondary, // TODO,
          color: $theme.colors.contentOnColor,
        };

      case 'Rejected':
        return {
          backgroundColor: $theme.colors.negative300,
          color: $theme.colors.contentOnColor,
        };

      default:
        return undefined;
    }
  }, [
    $theme.colors.backgroundSecondary,
    $theme.colors.contentOnColor,
    $theme.colors.contentPrimary,
    $theme.colors.negative200,
    $theme.colors.negative300,
    $theme.colors.positive400,
    $theme.colors.warning300,
    taskItem.status?.systemStatus,
  ]);

  return (
    <>
      <StatefulPopover
        onClick={(e) => {
          e.stopPropagation();
        }}
        content={({ close }) => (
          <StatefulMenu
            onItemSelect={(e) => {
              e.event?.stopPropagation();

              changeStatus({
                variables: {
                  input: {
                    taskId: taskItem.id,
                    statusId: e.item.itemId,
                  },
                },
                onCompleted: () => {
                  close();
                },
              });
            }}
            items={taskStatuses.taskStatuses.edges.map((res) => ({
              label: res?.node?.name,
              key: res?.node?.id,
              itemId: res?.node?.id,
              description: res?.node?.description,
            }))}
          />
        )}
        returnFocus
        autoFocus
      >
        {taskItem.status ? (
          <Button
            shape="pill"
            size="mini"
            colors={customColor}
            overrides={{
              Root: {
                style: {
                  width: 'calc(100% - 24px)',
                  minHeight: '16px',
                  marginRight: '6px',
                  minWidth: 'min-content',
                  whiteSpace: 'nowrap',
                },
              },
            }}
          >
            <span
              className={css({
                display: props.$isFull ? 'inherit' : 'none',
                [$theme.mediaQuery.medium]: {
                  display: 'inherit',
                },
              })}
            >
              {taskItem.status.name}
            </span>
          </Button>
        ) : (
          <Button
            size="mini"
            kind="tertiary"
            overrides={{}}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <DataShare />
          </Button>
        )}
      </StatefulPopover>
    </>
  );
}
