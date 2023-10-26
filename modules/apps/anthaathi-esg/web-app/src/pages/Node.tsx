import { ContentWrapper } from '@anthaathi/components';
import { useIntl } from 'react-intl';

export function NodePage() {
  const intl = useIntl();

  return (
    <ContentWrapper
      breadcrumb={[
        {
          title: 'Breadcrumb',
        },
      ]}
      toolbarTab={[
        {
          title: 'Hello world',
        },
      ]}
      title={intl.formatMessage({ defaultMessage: 'Node' })}
    >
      Hello world
    </ContentWrapper>
  );
}
