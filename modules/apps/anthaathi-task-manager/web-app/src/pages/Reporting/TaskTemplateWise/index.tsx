import { ContentWrapper } from '@anthaathi/components';
import { useIntl } from 'react-intl';

export default function TaskTemplateWise() {
  const intl = useIntl();

  return (
    <ContentWrapper
      title={intl.formatMessage({
        defaultMessage: 'Task Report',
      })}
      toolbarTab={[
        {
          title: intl.formatMessage({
            defaultMessage: 'Reporting',
          }),
        },
      ]}
      breadcrumb={[
        {
          title: intl.formatMessage({
            defaultMessage: 'Task Report',
          }),
        },
      ]}
    >
      <></>
    </ContentWrapper>
  );
}
