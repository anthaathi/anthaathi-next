import { Button } from 'baseui/button';
import React, { useMemo } from 'react';
import { Calendar } from '@carbon/icons-react';
import { StatefulPopover } from 'baseui/popover';
import { StatefulCalendar } from 'baseui/datepicker';
import { graphql, useFragment, useMutation } from 'react-relay';
import { TaskAssignDueDateMutation } from '../../../../__generated__/TaskAssignDueDateMutation.graphql';
import { Badge } from 'baseui/badge';
import { LabelMedium } from 'baseui/typography';
import { useIntl } from 'react-intl';
import { TaskAssignDueDate_taskDue$key } from '../../../../__generated__/TaskAssignDueDate_taskDue.graphql';
import { useStyletron } from 'baseui';

const todaysDate = new Date();
todaysDate.setHours(0, 0, 0, 0);

export interface TaskAssignDueDateProps {
  $key: TaskAssignDueDate_taskDue$key;
  isStartDate?: boolean;
}

export function TaskAssignDueDate(props: TaskAssignDueDateProps) {
  const [addDueDate, isLoading] =
    useMutation<TaskAssignDueDateMutation>(graphql`
      mutation TaskAssignDueDateMutation($input: ChangeTaskDueDateInput!) {
        changeTaskDueDate(input: $input) {
          task {
            id
            dueDate
            startDate
          }
        }
      }
    `);

  const taskItem = useFragment<TaskAssignDueDate_taskDue$key>(
    graphql`
      fragment TaskAssignDueDate_taskDue on Task {
        dueDate
        startDate
        id
      }
    `,
    props.$key
  );

  const dueDate = useMemo(() => {
    if (!taskItem.dueDate) {
      return;
    }
    return new Date(taskItem.dueDate);
  }, [taskItem.dueDate]);

  const todaysDate = useMemo(() => {
    return new Date();
  }, []);

  const isDueDateOneDayCloserToOneDay = useMemo(() => {
    return dueDate && dueDate.getTime() - todaysDate.getTime() < 86400000;
  }, [dueDate, todaysDate]);

  const intl = useIntl();

  const [, setIsOpen] = React.useState(false);

  const popover = (
    <StatefulPopover
      content={({ close }) => (
        <>
          <StatefulCalendar
            density="high"
            autoFocusCalendar={true}
            minDate={props.isStartDate ? undefined : todaysDate}
            maxDate={
              props.isStartDate === true && taskItem.dueDate
                ? new Date(taskItem.dueDate)
                : undefined
            }
            onChange={({ date }) => {
              if (!date) {
                return;
              }

              date = Array.isArray(date) ? date[0] : date;

              const year = date.getFullYear();
              const month = ('0' + (date.getMonth() + 1)).slice(-2); // Adding leading zero if necessary
              const day = ('0' + date.getDate()).slice(-2); // Adding leading zero if necessary

              addDueDate({
                variables: {
                  input: props.isStartDate
                    ? {
                        taskId: taskItem.id,
                        startDate: year + '-' + month + '-' + day,
                      }
                    : {
                        taskId: taskItem.id,
                        dueDate: year + '-' + month + '-' + day,
                      },
                },
                onCompleted: () => {
                  close();
                },
              });
            }}
          />
        </>
      )}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <Button
        isLoading={isLoading}
        overrides={{
          Root: {
            style: {
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            },
          },
        }}
        onMouseEnter={() => {
          setIsOpen(true);
        }}
        size="mini"
        kind="secondary"
        onClick={(e) => {
          e.stopPropagation();
        }}
        shape="circle"
      >
        <Calendar />
      </Button>
    </StatefulPopover>
  );

  const [css] = useStyletron();

  return (
    <LabelMedium>
      {dueDate ? (
        <div
          className={css({
            display: 'flex',
            alignItems: 'center',
          })}
        >
          {props.isStartDate ? (
            <>
              {taskItem.startDate
                ? intl.formatDate(new Date(taskItem.startDate))
                : '-'}
            </>
          ) : (
            <Badge
              color={
                todaysDate >= dueDate
                  ? 'negative'
                  : isDueDateOneDayCloserToOneDay
                  ? 'warning'
                  : 'accent'
              }
              content={intl.formatDate(dueDate)}
            />
          )}

          <span
            className={css({
              width: '4px',
            })}
          />

          {popover}
        </div>
      ) : (
        <>{popover}</>
      )}
    </LabelMedium>
  );
}
