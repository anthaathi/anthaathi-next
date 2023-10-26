import { useStyletron } from 'baseui';
import React, { useRef, useState } from 'react';
import { LabelMedium, LabelXSmall } from 'baseui/typography';
import { useRecoilState } from 'recoil';
import { taskSidebarAtom } from '@/features/Task/TaskSidebar/atom';
import { graphql, useFragment } from 'react-relay';
import { TaskItem_taskItem$key } from '../../../../__generated__/TaskItem_taskItem.graphql';
import { TaskAssignedStack } from '@/features/Task/TaskAssignedStack';
import { TaskAssignDueDate } from '@/features/Task/TaskAssignDueDate';
import { TaskStatus_taskStatuses$key } from '../../../../__generated__/TaskStatus_taskStatuses.graphql';
import { TaskStatus } from '@/features/Task/TaskStatus';
import { useTaskStatus } from '@/features/Task/TaskPriority';

export interface TaskItemProps {
  $key: TaskItem_taskItem$key;
  $statusKey: TaskStatus_taskStatuses$key;
}

export function TaskItem(props: TaskItemProps) {
  const [css, $theme] = useStyletron();
  const ref = useRef<HTMLDivElement>(null);

  const taskItem = useFragment(
    graphql`
      fragment TaskItem_taskItem on Task {
        title
        id
        dueDate
        priority

        ...TaskAssignDueDate_taskDue
        ...TaskAssignedStack_taskAssignedStack
        ...TaskStatus_taskItem
      }
    `,
    props.$key
  );

  const [, setTaskSidebarState] = useRecoilState(taskSidebarAtom);

  const [, setFocus] = useState(false);

  const status = useTaskStatus();

  return (
    <div
      onDragStart={(e) => {
        e.dataTransfer.dropEffect = 'move';
      }}
      draggable={true}
      className={css({
        borderRadius: $theme.borders.radius200,
        display: 'table-row',
        alignItems: 'center',
        cursor: 'pointer',
        userSelect: 'none',
        paddingLeft: $theme.sizing.scale200,
        [$theme.mediaQuery.medium]: {
          paddingLeft: $theme.sizing.scale600,
          paddingRight: $theme.sizing.scale600,
        },
        ':hover': {
          backgroundColor: $theme.colors.backgroundSecondary,
        },
      })}
      tabIndex={0}
      onFocus={() => {
        setFocus(true);
      }}
      onBlur={() => {
        setTimeout(() => {
          setFocus(false);
        }, 100);
      }}
      onMouseLeave={() => {
        setFocus(false);
      }}
      onMouseEnter={() => {
        setFocus(true);
      }}
      onClick={(e) => {
        if (
          (e.target as HTMLDivElement).closest('[data-type="avatar-stack"]') ||
          (e.target as HTMLDivElement).closest(
            '[data-type="target-ignore-click"]'
          )
        ) {
          return;
        }

        if (!(e.target as HTMLDivElement).closest('[data-type="task"]')) {
          return;
        }
        setTaskSidebarState(taskItem.id);
      }}
      data-type="task"
    >
      <div
        className={css({
          textAlign: 'center',
          minWidth: 'min-content',
          [$theme.mediaQuery.medium]: {
            width: '100px',
            display: 'table-cell',
          },
        })}
      >
        <TaskStatus $statusKey={props.$statusKey} $key={taskItem} />
      </div>

      <div
        className={css({
          display: 'table-cell',
        })}
      >
        <LabelMedium
          spellCheck={false}
          $style={{
            outline: 'none',
            lineHeight: $theme.typography.LabelMedium.fontSize,
            display: 'flex',
            alignItems: 'center',
          }}
          as="div"
        >
          {taskItem.title}

          {taskItem.priority && (
            <>
              &nbsp; &nbsp;
              <LabelXSmall
                overrides={{
                  Block: {
                    style: {
                      borderRadius: '4px',
                      padding: '2px 4px',
                    },
                  },
                }}
                backgroundColor={$theme.colors.contentTertiary}
                color={$theme.colors.contentOnColor}
              >
                {taskItem.priority
                  ? status.find((s) => s.key === taskItem.priority)?.label ??
                    taskItem.priority
                  : null}
              </LabelXSmall>
            </>
          )}
        </LabelMedium>
      </div>

      <div
        data-type="avatar-stack"
        className={css({
          display: 'none',
          position: 'relative',
          [$theme.mediaQuery.medium]: {
            paddingRight: '2px',
            display: 'table-cell',
            margin: 'auto',
          },
        })}
      >
        <div
          className={css({
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            position: 'absolute',
            top: 0,
            bottom: 0,
          })}
        >
          <TaskAssignedStack align="end" $key={taskItem} />
        </div>
      </div>

      <div
        ref={ref}
        className={css({
          flexGrow: 1,
          display: 'table-cell',
          paddingTop: $theme.sizing.scale600,
          paddingBottom: $theme.sizing.scale600,
          width: '100px',
          textAlign: 'right',
        })}
      >
        <TaskAssignDueDate $key={taskItem} />
      </div>
    </div>
  );
}
