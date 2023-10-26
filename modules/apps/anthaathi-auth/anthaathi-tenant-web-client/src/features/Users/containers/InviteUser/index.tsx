import { useState } from 'react';
import {
  Modal,
  ModalBody,
  ModalButton,
  ModalFooter,
  ModalHeader,
} from 'baseui/modal';
import { Button } from 'baseui/button';
import { FormattedMessage } from 'react-intl';
import { FormBuilderV2 } from '@anthaathi/components';
import { graphql, useMutation } from 'react-relay';
import {
  InviteUserMutation,
  OrganizationRole,
} from '../../../../../__generated__/InviteUserMutation.graphql';
import { useParams } from 'react-router-dom';
import { useSnackbar } from 'baseui/snackbar';

export function InviteUser() {
  const [isOpen, setIsOpen] = useState(false);

  const [inviteUser, isLoading] = useMutation<InviteUserMutation>(graphql`
    mutation InviteUserMutation(
      $orgKey: String!
      $emails: [String!]!
      $role: OrganizationRole!
    ) {
      inviteUser(input: { orgKey: $orgKey, emails: $emails, role: $role }) {
        success
      }
    }
  `);

  const [state, setState] = useState<{
    user: { label: string; id: string }[];
    role: OrganizationRole;
  }>({
    user: [],
    role: 'VIEWER',
  });

  const orgKey = useParams<{ key: string }>();

  const { enqueue } = useSnackbar();

  return (
    <>
      <Button
        size="compact"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        <FormattedMessage defaultMessage="Invite user" />
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
        overrides={{
          Dialog: {
            style: {
              width: '800px',
              maxWidth: '100%',
            },
          },
        }}
        size="auto"
      >
        <ModalHeader>
          <FormattedMessage defaultMessage="Invite user" />
        </ModalHeader>
        <ModalBody>
          <FormBuilderV2<typeof state>
            onChange={(e) => {
              setState(e);
            }}
            isLoading={isLoading}
            schema={{
              type: 'object',
              properties: {
                user: {
                  type: 'array',
                  title: 'Emails',
                  format: 'search',
                  cellProps: {
                    span: [12, 12, 6, 6],
                  },
                  creatable: true,
                  items: {
                    type: 'object',
                    title: 'Email',
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
                role: {
                  type: 'string',
                  title: 'Roles',
                  format: 'select',
                  default: 'VIEWER',
                  cellProps: {
                    span: [12, 12, 6, 6],
                  },
                  dataSource: {
                    type: 'static',
                    values: [
                      {
                        id: 'VIEWER',
                        label: 'Member',
                      },
                      {
                        id: 'EDITOR',
                        label: 'Editor',
                      },
                      {
                        id: 'ADMIN',
                        label: 'Owner',
                      },
                    ],
                  },
                },
              },
            }}
          />
        </ModalBody>

        <ModalFooter>
          <ModalButton
            kind="secondary"
            onClick={() => {
              setIsOpen(false);
            }}
          >
            <FormattedMessage defaultMessage="Cancel" />
          </ModalButton>
          <ModalButton
            onClick={() => {
              inviteUser({
                variables: {
                  emails: state.user
                    .map((res) => res.label)
                    .filter((res) => res.indexOf('@') !== -1),
                  role: state.role,
                  orgKey: orgKey?.key!,
                },
                onCompleted: (response, errors) => {
                  if (response?.inviteUser?.success) {
                    enqueue({
                      message: "User('s) are invited to the organization",
                    });
                    setIsOpen(false);
                  }
                },
              });
            }}
          >
            <FormattedMessage defaultMessage="Add memeber" />
          </ModalButton>
        </ModalFooter>
      </Modal>
    </>
  );
}
