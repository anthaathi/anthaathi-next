import { FormBuilderV2, JSONSchema } from '@anthaathi/components';
import { useIntl } from 'react-intl';
import { useMemo, useState } from 'react';
import { graphql, useLazyLoadQuery, useMutation } from 'react-relay';
import { CustomerCreateMutation } from '../../../../__generated__/CustomerCreateMutation.graphql';
import { useOrganizationContext } from '@/hooks/use-organization-id';
import { CustomerCreateQuery } from '../../../../__generated__/CustomerCreateQuery.graphql';

export const useCustomerForm = (
  extendWith?: JSONSchema | null,
  extraKey?: string,
  extraValue?: JSONSchema,
) => {
  const intl = useIntl();

  return useMemo(() => {
    const schema: JSONSchema = {
      type: 'object',
      required: ['phone'],
      properties: {
        name: {
          type: 'string',
          format: 'hidden',
          title: intl.formatMessage({ defaultMessage: 'Name' }),
          autoFocus: true,
        },
        firstName: {
          type: 'string',
          title: intl.formatMessage({ defaultMessage: 'First name' }),
          cellProps: {
            span: 6,
          },
        },
        lastName: {
          type: 'string',
          title: intl.formatMessage({ defaultMessage: 'Last name' }),
          cellProps: {
            span: 6,
          },
        },
        email: {
          type: 'string',
          title: intl.formatMessage({ defaultMessage: 'Email' }),
        },
        phoneNumber: {
          type: 'string',
          title: intl.formatMessage({ defaultMessage: 'Phone' }),
        },
        ...(extraKey
          ? {
              [extraKey]: extraValue as JSONSchema,
            }
          : {}),
        ...(extendWith
          ? {
              data: extendWith,
            }
          : {}),
        submit: {
          type: 'string',
          format: 'submit',
          title: extendWith
            ? intl.formatMessage({ defaultMessage: 'Save' })
            : intl.formatMessage({ defaultMessage: 'Create Customer' }),
          cellProps: {
            span: [12, 12, 3, 3],
            skip: [0, 0, 9, 9],
          },
        },
      },
    };

    return schema;
  }, [extendWith, extraKey, extraValue, intl]);
};

export interface CustomerCreateProps {
  onCustomerCreated: (customerId: string) => void;
}

export function CustomerCreate(props: CustomerCreateProps) {
  const [createCustomer, isLoading] = useMutation<CustomerCreateMutation>(
    graphql`
      mutation CustomerCreateMutation($input: CreateCustomerInput!) {
        createCustomer(input: $input) {
          customer {
            id
          }
        }
      }
    `,
  );

  const org = useOrganizationContext();

  const customerTemplate = useLazyLoadQuery<CustomerCreateQuery>(
    graphql`
      query CustomerCreateQuery($organization: ID!) {
        customerTemplates(organization: $organization) {
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
    {
      organization: org!.organizationByKey!.id!,
    },
  );

  const [state, setState] = useState<{
    name?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    phoneNumber?: string | null;
    data?: any | null;
    company?: string | null;
    template?: string | null;
  }>({
    data: {},
  });

  const intl = useIntl();

  const schema = useCustomerForm(
    customerTemplate.customerTemplates.edges.find(
      (res) => res?.node?.id === state.template,
    )?.node?.config ?? {
      type: 'object',
      properties: {},
    },
    'template',
    {
      type: 'string',
      title: intl.formatMessage({ defaultMessage: 'Customer type' }),
      format: 'card',
      dataSource: {
        type: 'static',
        values: [
          ...(customerTemplate.customerTemplates.edges.map((res) => ({
            id: res?.node?.id!,
            label: res?.node?.name!,
          })) ?? []),
        ],
      },
    },
  );

  return (
    <FormBuilderV2<typeof state>
      isLoading={isLoading}
      onChange={(e) => {
        setState(e);
      }}
      initialValue={{
        ...state,
        template: customerTemplate?.customerTemplates?.edges?.[0]?.node?.id,
        data: {},
      }}
      onSubmit={(e) => {
        createCustomer({
          variables: {
            input: {
              name:
                e.name ??
                ((e.firstName ?? '') + ' ' + (e.lastName ?? '')).trim(),
              firstName: e.firstName,
              lastName: e.lastName,
              email: e.email,
              phoneNumber: e.phoneNumber,
              data: e.data,
              template:
                e.template ||
                customerTemplate?.customerTemplates?.edges?.[0]?.node?.id,
              company: e.company,
              organization: org!.organizationByKey!.id!,
            },
          },
          onCompleted: (response, errors) => {
            props.onCustomerCreated(response!.createCustomer!.customer!.id!);
          },
        });
      }}
      schema={schema}
    />
  );
}
