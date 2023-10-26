import { DataTableV2 } from '@anthaathi/components';
import { StyledLink } from 'baseui/link';
import { Link, useParams } from 'react-router-dom';

export function OrderList() {
  const { orgKey: org } = useParams<{ orgKey: string }>();

  return (
    <>
      <DataTableV2
        initialViewState="table"
        initialState={{
          columnSizing: {
            orderNumber: 100,
            grandTotal: 100,
            numberOfItems: 100,
          },
        }}
        schema={{
          type: 'object',
          properties: {
            orderNumber: {
              type: 'string',
              title: '#',
              align: 'center',
            },
            co2: {
              align: 'center',
              type: 'string',
              title: 'CO2 emissions',
            },
            internalStatus: {
              type: 'string',
              align: 'center',
              title: 'Internal Status',
            },
            status: {
              type: 'string',
              title: 'Status',
              align: 'center',
            },
            city: {
              type: 'string',
              title: 'City/Emirate',
              align: 'center',
            },
            area: {
              type: 'string',
              title: 'Zone/Area',
              align: 'center',
            },
            orderDate: {
              type: 'string',
              title: 'Order Date',
              align: 'center',
            },
            customerDetails: {
              type: 'string',
              title: 'Customer details',
              align: 'center',
            },
            numberOfItems: {
              type: 'string',
              title: '# of items',
              align: 'center',
            },
            grandTotal: {
              type: 'string',
              title: 'Grand total',
              align: 'center',
            },
          },
        }}
        onStateChange={console.log}
        onTableAction={(input) => {
          console.log(input);
        }}
        data={[
          {
            id: '1',
            orderNumber: (
              <StyledLink $as={Link} to={`/o/${org}/EsgOrder/1`}>
                000015002
              </StyledLink>
            ),
            title: 'hello world',
            co2: '10M/t',
          },
        ]}
      />
    </>
  );
}
