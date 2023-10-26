import { HeadingMedium, LabelMedium, LabelXSmall } from 'baseui/typography';
import { graphql, useLazyLoadQuery, useMutation } from 'react-relay';
import { TaskDetailsQuery } from '../../../../__generated__/TaskDetailsQuery.graphql';
import { FormattedMessage, useIntl } from 'react-intl';
import React, { useState } from 'react';
import { useStyletron } from 'baseui';
import { FormBuilderV2 } from '@anthaathi/components';
import { Button } from 'baseui/button';
import CustomerCard from '@/features/Customer/CustomerCard';
import { TaskDetailsUpdateMutation } from '../../../../__generated__/TaskDetailsUpdateMutation.graphql';
import { useSnackbar } from 'baseui/snackbar';
import { TaskReferences } from '@/features/Task/TaskReferences';
import { Block } from 'baseui/block';
import { TaskAssignedStack } from '@/features/Task/TaskAssignedStack';
import { TaskAssignDueDate } from '@/features/Task/TaskAssignDueDate';
import { TaskStatus } from '@/features/Task/TaskStatus';
import { useOrganizationContext } from '@/hooks/use-organization-id';
import { TaskPriority } from '@/features/Task/TaskPriority';

export interface TaskDetailsProps {
  id: string;
}

export function TaskDetails({ id }: TaskDetailsProps) {
  const orgId = useOrganizationContext();

  const dataQuery = useLazyLoadQuery<TaskDetailsQuery>(
    graphql`
      query TaskDetailsQuery($id: ID!, $organization: ID!) {
        ...TaskStatus_taskStatuses @arguments(organization: $organization)

        node(id: $id) {
          ... on Task {
            id
            title
            description
            data
            createdAt
            updatedAt
            ...TaskReferences_taskReferences
            customer {
              ...CustomerCard_customer
            }
            ...TaskStatus_taskItem
            ...TaskAssignedStack_taskAssignedStack
            ...TaskAssignDueDate_taskDue
            ...TaskPriority_taskPriority
            template {
              id
              config
            }
          }
        }
      }
    `,
    {
      id,
      organization: orgId?.organizationByKey?.id!,
    }
  );

  const [css, $theme] = useStyletron();

  const intl = useIntl();

  const [state, setState] = useState(dataQuery.node?.data ?? {});

  const [updateTaskData, isLoading] =
    useMutation<TaskDetailsUpdateMutation>(graphql`
      mutation TaskDetailsUpdateMutation($input: UpdateTaskDataInput!) {
        updateTaskData(input: $input) {
          task {
            id
            data
            title
            description
          }
        }
      }
    `);

  const { enqueue } = useSnackbar();

  // TODO: This need to optimized
  const [isOpen, setIsOpen] = useState(
    !!dataQuery.node?.title?.startsWith('Created from')
  );

  if (!dataQuery.node) {
    return (
      <>
        <FormattedMessage defaultMessage="Task not found" />
      </>
    );
  }

  return (
    <div>
      <HeadingMedium
        marginTop="scale600"
        marginBottom="scale400"
        $style={{
          maxWidth: 'calc(100% - 48px)',
        }}
      >
        {dataQuery.node.title}
      </HeadingMedium>

      {dataQuery.node.customer && (
        <CustomerCard $key={dataQuery.node.customer} collapsed={true} />
      )}

      <div
        data-action="task-content"
        className={css({
          maxHeight: isOpen ? '1000px' : '200px',
          overflow: 'hidden',
          position: 'relative',
          transition: 'max-height 0.2s ease-in-out',
        })}
        onFocus={() => {
          setIsOpen(true);
        }}
      >
        <div
          onClick={() => {
            setIsOpen(true);
          }}
          className={css({
            position: 'absolute',
            bottom: '0px',
            right: '0px',
            left: '0px',
            top: 0,
            userSelect: 'none',
            pointerEvents: isOpen ? 'none' : 'auto',
            opacity: !isOpen ? '1' : '0',
            background:
              'linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(0,0,0,0) 100%)',
            borderRadius: '4px',
            transition: 'opacity 0.2s ease-in-out',
            overflow: 'hidden',
          })}
        />

        <Block paddingTop="scale600">
          <TaskReferences $key={dataQuery.node} />
        </Block>

        <div
          className={css({
            display: 'grid',
            gridTemplateColumns: '1fr',
          })}
        >
          <div>
            <LabelXSmall marginBottom="scale300" marginTop="scale400">
              <FormattedMessage defaultMessage="Status" />
            </LabelXSmall>

            <div
              className={css({
                width: 'max-content',
              })}
            >
              <TaskStatus
                $statusKey={dataQuery}
                $isFull={true}
                $key={dataQuery.node}
              />
            </div>
          </div>
        </div>

        <span
          className={css({
            display: 'flex',
            marginBottom: $theme.sizing.scale600,
          })}
        />

        <div
          className={css({
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
          })}
        >
          <div>
            <LabelXSmall>
              <FormattedMessage defaultMessage="Created at" />
            </LabelXSmall>

            <LabelMedium marginBottom="scale300">
              {intl.formatDate(new Date(dataQuery.node.createdAt), {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </LabelMedium>
          </div>

          <div>
            <LabelXSmall>
              <FormattedMessage defaultMessage="Updated at" />
            </LabelXSmall>

            <LabelMedium marginBottom="scale300">
              {intl.formatDate(new Date(dataQuery.node.createdAt), {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </LabelMedium>
          </div>
        </div>

        <LabelXSmall marginBottom="scale300" marginTop="scale400">
          <FormattedMessage defaultMessage="Assigned" />
        </LabelXSmall>

        <TaskAssignedStack align="start" $key={dataQuery.node} />

        <Block paddingTop="scale200" />

        <div
          className={css({
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
          })}
        >
          <div>
            <LabelXSmall marginBottom="scale300" marginTop="scale400">
              <FormattedMessage defaultMessage="Start date" />
            </LabelXSmall>

            <TaskAssignDueDate $key={dataQuery.node} isStartDate={true} />
          </div>
          <div>
            <LabelXSmall marginBottom="scale300" marginTop="scale400">
              <FormattedMessage defaultMessage="Due date" />
            </LabelXSmall>

            <TaskAssignDueDate $key={dataQuery.node} />
          </div>
        </div>

        <div>
          <LabelXSmall marginBottom="scale300" marginTop="scale400">
            <FormattedMessage defaultMessage="Priority" />
          </LabelXSmall>

          <TaskPriority $key={dataQuery.node} />
        </div>
      </div>

      <div
        className={css({
          paddingBottom: $theme.sizing.scale600,

          [$theme.mediaQuery.large]: {
            width: 'calc(100% + 48px)',
            marginLeft: '-24px',
          },

          borderBottom: `1px solid ${$theme.colors.borderOpaque}`,
        })}
      />

      <Block paddingTop="scale200" />

      <Block display="flex" alignItems="center" placeContent="center">
        <Button
          size="mini"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
          kind="tertiary"
          overrides={{
            Root: {
              style: {
                width: '100%',
              },
            },
          }}
        >
          {isOpen ? (
            <FormattedMessage defaultMessage="Hide" />
          ) : (
            <FormattedMessage defaultMessage="Show" />
          )}
        </Button>
      </Block>

      <FormBuilderV2
        schema={dataQuery.node.template?.config}
        initialValue={dataQuery.node.data ?? {}}
        onChange={(value) => {
          setState(value);
        }}
      />

      <div
        className={css({
          position: 'sticky',
          bottom: '12px',
          display: 'flex',
          justifyContent: 'flex-end',
        })}
      >
        <Button
          overrides={{
            Root: {
              style: {
                minWidth: '120px',
              },
            },
          }}
          isLoading={isLoading}
          onClick={() => {
            updateTaskData({
              variables: {
                input: {
                  id: dataQuery.node!.id!,
                  data: state,
                },
              },
              onCompleted: () => {
                enqueue({
                  message: intl.formatMessage({
                    defaultMessage: 'Task updated',
                  }),
                });
              },
            });
          }}
        >
          {intl.formatMessage({ defaultMessage: 'Save' })}
        </Button>
      </div>
    </div>
  );
}
