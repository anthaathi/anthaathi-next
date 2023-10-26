import { FormBuilderV2, JSONSchema } from '@anthaathi/components';
import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { graphql, useFragment, useMutation } from 'react-relay';
import { OrganizationTypeSelection_index$key } from '../../../../../__generated__/OrganizationTypeSelection_index.graphql';
import { OrganizationTypeSelection_createOrganizationMutation } from '../../../../../__generated__/OrganizationTypeSelection_createOrganizationMutation.graphql';
import { useSnackbar } from 'baseui/snackbar';
import { useSearchParams } from 'react-router-dom';

export function OrganizationCreate(props: {
  $key: OrganizationTypeSelection_index$key;
  onNext: (orgId: string) => void;
}) {
  const intl = useIntl();

  const [, setSearchParams] = useSearchParams();

  const templates = useFragment(
    graphql`
      fragment OrganizationTypeSelection_index on Query
      @argumentDefinitions(
        id: { type: "ID" }
        renderOrganizationTemplate: { type: "Boolean!" }
      ) {
        organizationTemplates(first: 100) {
          edges {
            node {
              name
              description
              id
            }
          }
        }

        organizationTemplateById(id: $id)
          @include(if: $renderOrganizationTemplate) {
          id
          ... on OrganizationTemplate {
            config
          }
        }
      }
    `,
    props.$key,
  );

  const schema = useMemo(() => {
    const template = templates.organizationTemplateById?.config;

    return {
      type: 'object',
      required: ['name', 'type', 'key'],
      properties: {
        name: {
          type: 'string',
          title: 'Organization name',
          description: intl.formatMessage({
            defaultMessage: 'Name of organization',
          }),
					autoFocus: true,
        },
        key: {
          type: 'string',
          title: 'Domain',
          suffix: '.anthaathi.co',
          caption:
            'Enter a valid subdomain. It must start and end with a letter or number. Only letters, numbers, and hyphens are allowed. The length should be between 3 to 63 characters.',
          maxLength: 63,
          pattern: '[a-zA-Z0-9][a-zA-Z0-9\\-]{1,61}[a-zA-Z0-9]',
        },
        description: {
          type: 'string',
          format: 'textarea',
          title: 'Description',
          description: 'About your organization',
        },
        type: {
          type: 'string',
          format: 'card',
          title: intl.formatMessage({
            defaultMessage:
              'Select the type that best describes your organization.',
          }),
          dataSource: {
            type: 'static',
            values: templates.organizationTemplates.edges.map((res) => ({
              id: res?.node?.id!,
              label: res?.node?.name!,
              description: res?.node?.description!,
            })),
          },
        },
        data: template ? template : { type: 'object', properties: {} },
        submit: {
          type: 'string',
          format: 'submit',
          cellProps: {
            span: [12, 6, 4],
          },
          title: intl.formatMessage({ defaultMessage: 'Create Organization' }),
        },
      },
    } as JSONSchema;
  }, [
    intl,
    templates.organizationTemplateById?.config,
    templates.organizationTemplates.edges,
  ]);

  const initialValues = useMemo(
    () => ({
      type: templates.organizationTemplates?.edges?.map(
        (res) => res?.node?.id,
      )[0],
      data: {
        phone: {},
      },
    }),
    [templates.organizationTemplates?.edges],
  );

  const [createOrganization, isLoading] =
    useMutation<OrganizationTypeSelection_createOrganizationMutation>(graphql`
      mutation OrganizationTypeSelection_createOrganizationMutation(
        $input: CreateOrganizationInput!
      ) {
        createOrganization(input: $input) {
          result {
            id
            key
            iid
          }
        }
      }
    `);

  const { enqueue } = useSnackbar();

  return (
    <>
      <FormBuilderV2<{
        type: string;
        name: string;
        key: string;
        description: string;
      }>
        initialValue={initialValues}
        schema={schema}
        onChange={(e) => {
          const search = new URLSearchParams();
          if (e.type) {
            search.set('type', e.type);
          }
          setSearchParams(search, {
            replace: true,
          });
        }}
        isLoading={isLoading}
        onSubmit={async (input) => {
          createOrganization({
            variables: {
              input: {
                name: input.name,
                description: input.description,
                key: input.key,
                data: {},
                templateId: input.type,
              },
            },
            onCompleted: (response) => {
              if (response.createOrganization.result.id) {
                props.onNext(response.createOrganization.result.key);
              }
            },
            onError: (error) => {
              enqueue({
                message:
                  (error as any)?.source?.errors?.[0]?.message ?? error.message,
              });
            },
          });
        }}
      />
    </>
  );
}
