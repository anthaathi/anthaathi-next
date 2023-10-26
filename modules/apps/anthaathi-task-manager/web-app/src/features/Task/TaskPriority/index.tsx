import { graphql, useFragment, useMutation } from 'react-relay';
import { TaskPriority_taskPriority$key } from '../../../../__generated__/TaskPriority_taskPriority.graphql';
import { StatefulPopover } from 'baseui/popover';
import { StatefulMenu } from 'baseui/menu';
import React, { useMemo } from 'react';
import { Button } from 'baseui/button';
import { useIntl } from 'react-intl';
import { TaskPriorityMutation } from '../../../../__generated__/TaskPriorityMutation.graphql';

export interface TaskPriorityProps {
  $key: TaskPriority_taskPriority$key;
}

export const useTaskStatus = () => {
  const intl = useIntl();

  return useMemo(() => {
    return [
      {
        label: intl.formatMessage({ defaultMessage: 'Low 🔶' }),
        key: 'low',
      },
      {
        label: intl.formatMessage({ defaultMessage: 'Medium ⚠️' }),
        key: 'medium',
      },
      {
        label: intl.formatMessage({ defaultMessage: 'High 🔴' }),
        key: 'high',
      },
      {
        label: intl.formatMessage({ defaultMessage: 'Urgent ❗❗' }),
        key: 'urgent',
      },
      {
        label: intl.formatMessage({
          defaultMessage: 'Critical ❗❗❗',
        }),
        key: 'critical',
      },
      {
        label: intl.formatMessage({ defaultMessage: 'None' }),
        key: 'none',
      },
    ];
  }, [intl]);
};

export function TaskPriority(props: TaskPriorityProps) {
  const [changePriority] = useMutation<TaskPriorityMutation>(graphql`
    mutation TaskPriorityMutation($input: UpdateTaskPriorityInput!) {
      updateTaskPriority(input: $input) {
        task {
          id
          priority
        }
      }
    }
  `);

  const priority = useFragment(
    graphql`
      fragment TaskPriority_taskPriority on Task {
        priority
        id
      }
    `,
    props.$key
  );

  const intl = useIntl();

  const Status = useTaskStatus();

  return (
    <>
      <StatefulPopover
        content={({ close }) => (
          <StatefulMenu
            items={Status}
            onItemSelect={(item) => {
              changePriority({
                variables: {
                  input: {
                    taskId: priority.id,
                    priority: item.item.key === 'none' ? null : item.item.key,
                  },
                },
                onCompleted: () => {
                  close();
                },
              });
            }}
          />
        )}
        placement="bottomLeft"
      >
        <Button size="mini" kind="secondary" shape="pill">
          {!priority?.priority
            ? intl.formatMessage({ defaultMessage: 'Change priority' })
            : Status.find((res) => res.key === priority.priority)?.label ??
              priority.priority}
        </Button>
      </StatefulPopover>
    </>
  );
}
