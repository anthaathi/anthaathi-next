import {
  CardContent,
  ContentWrapper,
  DetailViewerCard,
} from '@anthaathi/components';
import { useIntl } from 'react-intl';
import { graphql, useLazyLoadQuery } from 'react-relay';
import { UserInfoQuery } from '../../../__generated__/UserInfoQuery.graphql';
import { useParams } from 'react-router-dom';
import { useOrganizationContext } from '@/hooks/use-organization-id';
import { TaskList } from '@/features/Task/TaskList';
import { useStyletron } from 'styletron-react';
import { StyledLink } from 'baseui/link';

export default function UserInfo() {
  const intl = useIntl();

  const org = useOrganizationContext();

  const { id } = useParams<{ id: string }>();

  const [css] = useStyletron();

  const query = useLazyLoadQuery<UserInfoQuery>(
    graphql`
      query UserInfoQuery($id: ID!, $organization: ID!) {
        node(id: $id) {
          id

          ... on UserCore {
            email {
              email
              verified
            }
            firstName
            lastName
          }
        }

        ...TaskList_taskFragment
          @arguments(organization: $organization, assignedTo: [$id])
      }
    `,
    {
      id: 'gid://Anthaathi/UserCore/' + id,
      organization: org?.organizationByKey?.id!,
    }
  );

  return (
    <ContentWrapper
      breadcrumb={[
        {
          to: '/',
          title: intl.formatMessage({ defaultMessage: 'Anthaathi Tasks' }),
        },
        {
          title: org?.organizationByKey?.name,
        },
        {
          title: intl.formatMessage({ defaultMessage: 'Users' }),
          to: '/o/' + org?.organizationByKey?.key + '/users',
        },
      ]}
      toolbarTab={[
        {
          title: intl.formatMessage({ defaultMessage: 'Overview' }),
        },
      ]}
      title={`${query.node?.firstName} ${query.node?.lastName}`}
    >
      <div
        className={css({
          display: 'grid',
          gridTemplateColumn: 'repeat(3, 1fr)',
        })}
      >
        <div
          className={css({
            gridArea: '1 / 1 / 2 / 3',
          })}
        >
          <TaskList $key={query} includeKPI={true} />
        </div>

        <div
          className={css({
            gridArea: '1 / 3 / 2 / 4',
          })}
        >
          <DetailViewerCard
            title={`${query.node?.firstName} ${query.node?.lastName}`}
          >
            <CardContent>
              {query.node?.email?.map((email, index) => (
                <StyledLink href={'mailto:' + email} key={email.email + index}>
                  {email.email}
                </StyledLink>
              ))}
            </CardContent>
          </DetailViewerCard>
        </div>
      </div>
    </ContentWrapper>
  );
}
