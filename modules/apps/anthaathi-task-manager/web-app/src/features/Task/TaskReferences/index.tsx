import { graphql, useMutation, usePaginationFragment } from 'react-relay';
import { TaskReferences_taskReferences$key } from '../../../../__generated__/TaskReferences_taskReferences.graphql';
import { Modal, ModalBody, ModalHeader } from 'baseui/modal';
import { FormattedMessage } from 'react-intl';
import React, { useState } from 'react';
import { Button, SIZE } from 'baseui/button';
import { SelectCustomer } from '@/features/Customer/SelectCustomer';
import { TaskReferencesAddReferenceMutation } from '../../../../__generated__/TaskReferencesAddReferenceMutation.graphql';
import { useOrganizationContext } from '@/hooks/use-organization-id';
import { Link } from 'react-router-dom';
import { useStyletron } from 'baseui';
import { Add } from '@carbon/icons-react';

export interface TaskReferencesProps {
  $key: TaskReferences_taskReferences$key;
}

export function TaskReferences(props: TaskReferencesProps) {
  const taskReferences = usePaginationFragment(
    graphql`
      fragment TaskReferences_taskReferences on Task
      @argumentDefinitions(after: { type: "String" }, first: { type: "Int" })
      @refetchable(queryName: "TaskReferencesPaginationQuery") {
        id
        referredBy: referredByV2(first: $first, after: $after)
          @connection(key: "TaskReferences_referredBy") {
          edges {
            node {
              customer {
                id
                iid
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

  const [isCustomerSelectOpen, setCustomerSelectOpen] = useState(false);

  const [addNewReferenceToTheTask] =
    useMutation<TaskReferencesAddReferenceMutation>(graphql`
      mutation TaskReferencesAddReferenceMutation(
        $input: AddReferenceToTaskInput!
      ) {
        addReferenceToTask(input: $input) {
          task {
            id
            ...TaskReferences_taskReferences
          }
        }
      }
    `);

  const organizationId = useOrganizationContext();

  const [css] = useStyletron();

  return (
    <div
      className={css({
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '4px',
      })}
    >
      {taskReferences.data.referredBy.edges.map((res, index) => {
        return (
          <Button
            key={(res?.node?.customer?.id ?? '') + index}
            kind="primary"
            size={SIZE.mini}
            $as={Link}
            to={`/o/${organizationId?.organizationByKey?.key}/customer/${res?.node.customer.iid}`}
          >
            {res?.node.customer.firstName} {res?.node.customer.lastName}
          </Button>
        );
      })}

      <Button
        kind="secondary"
        size={SIZE.mini}
        onClick={() => {
          setCustomerSelectOpen(true);
        }}
        startEnhancer={<Add />}
      >
        <FormattedMessage defaultMessage="Add Reference" />
      </Button>

      <Modal
        isOpen={isCustomerSelectOpen}
        onClose={() => {
          setCustomerSelectOpen(false);
        }}
      >
        <ModalHeader>
          <FormattedMessage defaultMessage="Select customer who referred this task" />
        </ModalHeader>

        <ModalBody>
          <SelectCustomer
            onSelectCustomer={(customerId) => {
              addNewReferenceToTheTask({
                variables: {
                  input: {
                    taskId: taskReferences.data.id,
                    customerId: customerId,
                  },
                },
                onCompleted() {
                  setCustomerSelectOpen(false);
                },
              });
            }}
          />
        </ModalBody>
      </Modal>
    </div>
  );
}
