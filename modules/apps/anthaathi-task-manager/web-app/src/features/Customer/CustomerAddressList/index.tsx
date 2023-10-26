import { graphql, usePaginationFragment } from 'react-relay';
import { CustomerAddressList_customer$key } from '../../../../__generated__/CustomerAddressList_customer.graphql';
import { AddressCard } from '@/features/Common/AddressCard';
import { useStyletron } from 'baseui';
import { LabelMedium } from 'baseui/typography';
import { useIntl } from 'react-intl';

export interface CustomerAddressListProps {
  $key: CustomerAddressList_customer$key;
}

export function CustomerAddressList(props: CustomerAddressListProps) {
  const { data: customerAddress } = usePaginationFragment(
    graphql`
      fragment CustomerAddressList_customer on Customer
      @refetchable(queryName: "CustomerAddressListPaginationQuery")
      @argumentDefinitions(
        first: { type: "Int", defaultValue: 10 }
        after: { type: "String" }
      ) {
        addresses(first: $first, after: $after)
          @connection(key: "CustomerAddressList_addresses") {
          edges {
            node {
							id
              ...AddressCard_address
            }
          }
        }
      }
    `,
    props.$key
  );

  const [css] = useStyletron();

  const intl = useIntl();

  return (
    <div>
      {customerAddress.addresses.edges.length !== 0 && (
        <LabelMedium
          $style={{
            padding: '12px',
          }}
        >
          {intl.formatMessage({ defaultMessage: 'Customer addresses' })}
        </LabelMedium>
      )}

      <div
        className={css({
          display: 'flex',
          gap: '12px',
        })}
      >
        {customerAddress.addresses.edges.map((res) => (
          <div
						key={res?.node?.id}
            className={css({
              width: '100%',
            })}
          >
            <AddressCard $key={res?.node!} />
          </div>
        ))}
      </div>
    </div>
  );
}
