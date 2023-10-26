import { FormattedMessage } from 'react-intl';
import { Button } from 'baseui/button';
import React, { useState } from 'react';
import { Modal, ModalBody, ModalHeader } from 'baseui/modal';
import { FormBuilderV2 } from '@anthaathi/components';

export function MemberAdd() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        size="compact"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        <FormattedMessage defaultMessage="Add member" />
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      >
        <ModalHeader>
          <FormattedMessage defaultMessage="Add new users to group" />
        </ModalHeader>
        <ModalBody>
          <FormBuilderV2
            onSubmit={console.log}
            schema={{
              type: 'object',
              properties: {
                user: {
                  type: 'array',
                  format: 'search',
                  title: 'User',
                  dataSource: {
                    type: 'dynamic',
                    name: 'user',
                  },
                  items: {
                    type: 'object',
                    properties: {
                      id: {
                        type: 'string',
                        title: 'Id',
                      },
                      label: {
                        type: 'string',
                        title: 'Label',
                      },
                    },
                  },
                },
                submit: {
                  type: 'string',
                  format: 'submit',
                  title: 'Add member',
                  cellProps: {
                    span: 5,
                    skip: 7,
                  },
                },
              },
            }}
          />
        </ModalBody>
      </Modal>
    </>
  );
}
