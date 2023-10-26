import React from 'react';
import { AvatarStack } from '@anthaathi/components';
import { graphql, useFragment, useMutation } from 'react-relay';
import { TaskAssignedStack_taskAssignedStack$key } from '../../../../__generated__/TaskAssignedStack_taskAssignedStack.graphql';
import { UserSelectorPopup } from '@/features/User/UserSelectorPopup';
import { TaskAssignedStackUpdateAssignedTaskMutation } from '../../../../__generated__/TaskAssignedStackUpdateAssignedTaskMutation.graphql';

export interface TaskAssignedStackProps {
  $key: TaskAssignedStack_taskAssignedStack$key;
  align?: 'start' | 'end';
}

export function TaskAssignedStack(props: TaskAssignedStackProps) {
  const assignedTask = useFragment(
    graphql`
      fragment TaskAssignedStack_taskAssignedStack on Task
      @argumentDefinitions(
        first: { type: "Int", defaultValue: 5 }
        after: { type: "String" }
      ) {
        id
        assigned(first: $first, after: $after)
          @connection(key: "TaskAssignedStack_assigned") {
          edges {
            node {
              id
              assignedAt
              user {
                id
                firstName
                lastName
              }
            }
          }
        }
      }
    `,
    props.$key
  );

  const [xy, setXY] = React.useState<{ x: number; y: number } | null>(null);

  const [updateAssignedTask, isLoading] =
    useMutation<TaskAssignedStackUpdateAssignedTaskMutation>(graphql`
      mutation TaskAssignedStackUpdateAssignedTaskMutation(
        $input: AssignUserToTaskInput!
      ) {
        assignUserToTask(input: $input) {
          task {
            ...TaskAssignedStack_taskAssignedStack
          }
        }
      }
    `);

  return (
    <>
      {xy && (
        <UserSelectorPopup
          isLoading={isLoading}
          onClose={(result) => {
            if (result) {
              updateAssignedTask({
                variables: {
                  input: {
                    taskId: assignedTask.id,
                    userId: result,
                  },
                },
                onCompleted: () => {
                  setXY(null);
                },
              });
            }

            setXY(null);
          }}
          x={xy.x}
          y={xy.y}
        />
      )}

      <AvatarStack
        align={props.align}
        onAssign={(event) => {
          event.stopPropagation();

          const element = event.currentTarget.getBoundingClientRect();

          setXY({
            x: element.x,
            y: element.y + element.width + 4,
          });
        }}
        items={assignedTask.assigned.edges.map((edge) => ({
          title: `${edge?.node.user.firstName} ${edge?.node.user.lastName}`,
          key: edge?.node.user.id!,
        }))}
        canAssign={true}
      />
    </>
  );
}
