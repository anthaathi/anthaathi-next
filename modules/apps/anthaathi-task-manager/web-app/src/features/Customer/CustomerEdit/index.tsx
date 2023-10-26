import { graphql, useFragment, useMutation } from 'react-relay';
import { CustomerEdit_customer$key } from '../../../../__generated__/CustomerEdit_customer.graphql';
import { useCustomerForm } from '@/features/Customer/CustomerCreate';
import { FormBuilderV2 } from '@anthaathi/components';
import { CustomerEditUpdateCustomerMutation } from '../../../../__generated__/CustomerEditUpdateCustomerMutation.graphql';

export interface CustomerEditProps {
  $key: CustomerEdit_customer$key;
  onEdit: () => void;
}

export function CustomerEdit(props: CustomerEditProps) {
  const query = useFragment(
    graphql`
      fragment CustomerEdit_customer on Customer {
        id
        data
        firstName
        lastName
        name
        email
        phoneNumber
        company
        data
        template {
          name
          config
        }
      }
    `,
    props.$key
  );

  const [updateCustomer, isLoading] =
    useMutation<CustomerEditUpdateCustomerMutation>(graphql`
      mutation CustomerEditUpdateCustomerMutation(
        $input: UpdateCustomerInput!
      ) {
        updateCustomer(input: $input) {
          customer {
            id
            data
            name
            firstName
            lastName
            email
            phoneNumber
            company
          }
        }
      }
    `);

  const customer = useCustomerForm(query.template?.config);

  return (
    <>
      <FormBuilderV2<{
        name?: string | null;
        firstName?: string | null;
        lastName?: string | null;
        email?: string | null;
        phoneNumber?: string | null;
        company?: string | null;
        data?: any;
      }>
        isLoading={isLoading}
        onSubmit={(e) => {
          updateCustomer({
            variables: {
              input: {
                id: query.id,
                firstName: e.firstName,
                lastName: e.lastName,
                email: e.email,
                phoneNumber: e.phoneNumber,
                company: e.company,
                data: e.data,
              },
            },
            onCompleted: () => {
              props.onEdit();
            },
          });
        }}
        schema={customer}
        initialValue={query}
      />
    </>
  );
}
