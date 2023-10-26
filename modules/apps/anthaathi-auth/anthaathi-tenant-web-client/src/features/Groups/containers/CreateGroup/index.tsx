import React, { Suspense, useState } from 'react';
import { Button } from 'baseui/button';
import { Modal, ModalBody, ModalHeader } from 'baseui/modal';
import { FormattedMessage } from 'react-intl';
import { FormBuilderV2 } from '@anthaathi/components';
import { graphql, useLazyLoadQuery, useMutation } from 'react-relay';
import { CreateGroupFormQuery } from '../../../../../__generated__/CreateGroupFormQuery.graphql';
import { CreateGroupMutation } from '../../../../../__generated__/CreateGroupMutation.graphql';
import { useNavigate, useParams } from 'react-router-dom';

export function CreateGroup() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        size="compact"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        <FormattedMessage defaultMessage="Create group" />
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      >
        <ModalHeader>
          <FormattedMessage defaultMessage="Create group" />
        </ModalHeader>
        <ModalBody>
          <Suspense>
            <CreateGroupForm />
          </Suspense>
        </ModalBody>
      </Modal>
    </>
  );
}

function CreateGroupForm() {
  const [createGroup, isLoading] = useMutation<CreateGroupMutation>(graphql`
    mutation CreateGroupMutation(
      $name: String!
      $description: String
      $data: Json!
      $groupTemplateId: ID!
      $orgKey: String!
    ) {
      createGroup(
        input: {
          name: $name
          description: $description
          data: $data
          groupTemplateId: $groupTemplateId
          orgKey: $orgKey
        }
      ) {
        group {
          id
          iid
        }
      }
    }
  `);

  const { groupTemplates } = useLazyLoadQuery<CreateGroupFormQuery>(
    graphql`
      query CreateGroupFormQuery {
        groupTemplates {
          edges {
            node {
              id
              name
              description
              config
            }
          }
        }
      }
    `,
    {},
  );

  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const params = useParams<{ key: string }>();

  const navigate = useNavigate();

  return (
    <>
      <FormBuilderV2<{
        name: string;
        description: string;
        template: string;
        data: any;
      }>
        isLoading={isLoading}
        initialValue={{
          template: groupTemplates.edges[0]?.node?.id,
        }}
        onChange={(e) => {
          setSelectedTemplate(e.template || null);
        }}
        onSubmit={(input) => {
          createGroup({
            variables: {
              data: input.data,
              description: input.description,
              orgKey: params.key!,
              name: input.name,
              groupTemplateId: input.template,
            },
            onCompleted: (response, errors) => {
              navigate(
                '/o/' +
                  params.key +
                  '/group/' +
                  response.createGroup.group?.iid,
              );
            },
          });
        }}
        schema={{
          type: 'object',
          required: ['name', 'template'],
          properties: {
            name: {
              type: 'string',
              title: 'Name',
              autoFocus: true,
            },
            description: {
              type: 'string',
              format: 'textarea',
              title: 'Description',
            },
            template: {
              type: 'string',
              format: 'card',
              title: 'Template',
              dataSource: {
                type: 'static',
                values: groupTemplates.edges.map((res) => ({
                  label: res?.node?.name!,
                  id: res?.node?.id!,
                })),
              },
            },
            data: selectedTemplate
              ? groupTemplates.edges.find(
                  (edge) => edge?.node?.id === selectedTemplate,
                )?.node?.config
              : { type: 'object', properties: {} },
            create: {
              type: 'string',
              format: 'submit',
              title: 'Create',
              cellProps: {
                skip: 8,
                span: 6,
              },
            },
          },
        }}
      />
    </>
  );
}
