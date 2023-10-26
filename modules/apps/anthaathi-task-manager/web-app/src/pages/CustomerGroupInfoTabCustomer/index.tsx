import { CustomerTable } from '@/features/Customer/CustomerTable';
import { CustomerGroupInfoQuery$data } from '../../../__generated__/CustomerGroupInfoQuery.graphql';
import { useOutletContext } from 'react-router-dom';

export default function CustomerGroupInfoTabCustomer() {
  const context = useOutletContext<CustomerGroupInfoQuery$data>();

  return <CustomerTable customers={context} />;
}
