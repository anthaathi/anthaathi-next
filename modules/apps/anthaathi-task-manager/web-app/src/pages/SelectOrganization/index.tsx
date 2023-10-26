import {
  ContentWrapper,
  DataTableV2,
  DefaultLayout,
} from '@anthaathi/components';
import { graphql, useLazyLoadQuery } from 'react-relay';
import type { SelectOrganizationQuery } from '../../../__generated__/SelectOrganizationQuery.graphql';
import { useIntl } from 'react-intl';
import { Building } from '@carbon/icons-react';
import { useNavigate } from 'react-router-dom';

export default function SelectOrganization() {
  const data = useLazyLoadQuery<SelectOrganizationQuery>(
    graphql`
      query SelectOrganizationQuery {
        organizations {
          edges {
            node {
              id
              name
              key
            }
          }
        }
      }
    `,
    {}
  );

  const intl = useIntl();

  const navigate = useNavigate();

  return (
    <DefaultLayout
      pageTitle={intl.formatMessage({ defaultMessage: 'Anthaathi Tasks' })}
      items={[]}
    >
      <ContentWrapper
        breadcrumb={[
          {
            title: 'Organizations',
          },
        ]}
        toolbarTab={[
          {
            title: 'Organizations',
          },
        ]}
        title={intl.formatMessage({
          defaultMessage: 'Select your organization',
        })}
      >
        <DataTableV2<{
          id: string;
          key: string;
          title: string;
        }>
          defaultIcon={<Building />}
          onClick={({ key }) => {
            navigate('/o/' + key + '/');
          }}
          data={data.organizations.edges.map((res, index) => ({
            id: (res?.node?.id ?? '') + index,
            title: res?.node.name + '',
            key: res?.node.key!,
          }))}
        />
      </ContentWrapper>
    </DefaultLayout>
  );
}
