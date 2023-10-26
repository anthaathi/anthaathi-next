import { NewTaskButton } from '@/features/Task/NewTaskButton';
import { TaskList } from '@/features/Task/TaskList';
import { useOrganizationContext } from '@/hooks/use-organization-id';
import { ContentWrapper, useSession } from '@anthaathi/components';
import { Block } from 'baseui/block';
import { HeadingXSmall } from 'baseui/typography';
import { FormattedMessage, useIntl } from 'react-intl';
import { graphql, useLazyLoadQuery } from 'react-relay';
import { HomeDashboardQuery } from '../../../__generated__/HomeDashboardQuery.graphql';
import { useStyletron } from 'baseui';
import { StyledLink } from 'baseui/link';
import { Link } from 'react-router-dom';

export default function HomePage() {
  const intl = useIntl();

  const org = useOrganizationContext();

  const session = useSession();

  const dashboardQuery = useLazyLoadQuery<HomeDashboardQuery>(
    graphql`
      query HomeDashboardQuery($organization: ID!, $assignedTo: [ID!]) {
        ...TaskList_taskFragment
          @arguments(
            organization: $organization
            assignedTo: $assignedTo
            includeCompleted: false
          )
      }
    `,
    {
      organization: org?.organizationByKey?.id!,
      assignedTo: ['gid://Anthaathi/UserCore/' + session?.identity.id!],
    },
    {
      fetchPolicy: 'store-and-network',
    }
  );

  const [css] = useStyletron();

  return (
    <ContentWrapper
      title={intl.formatMessage({ defaultMessage: 'Home' })}
      breadcrumb={[
        {
          title: intl.formatMessage({ defaultMessage: 'Anthaathi Tasks' }),
          to: '/',
        },
      ]}
      maxWidth="940px"
      center
      toolbarTab={[
        {
          title: intl.formatMessage({ defaultMessage: 'Overview' }),
          key: 'home',
        },
      ]}
    >
      <Block maxWidth="940px" margin="0 auto">
        <HeadingXSmall marginTop="scale0" marginBottom="scale0">
          {intl.formatMessage({ defaultMessage: 'My tasks' })}
        </HeadingXSmall>

        <TaskList
          $key={dashboardQuery}
          includeKPI={true}
          extra={
            <>
              <span
                className={css({
                  flexGrow: 1,
                })}
              />

              <StyledLink
                $as={Link}
                to={`/o/${org?.organizationByKey?.key}/tasks`}
              >
                <FormattedMessage defaultMessage="View All" />
              </StyledLink>
            </>
          }
        />

        <NewTaskButton />
      </Block>
    </ContentWrapper>
  );
}
