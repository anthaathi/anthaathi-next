import {
  BadgeList,
  BadgeListItem,
  BadgeSize,
  ContentWrapper,
  DataTableV2,
} from '@anthaathi/components';
import { FormattedMessage, useIntl } from 'react-intl';
import { Block } from 'baseui/block';
import {CarbonAccounting, Group, Task, User} from '@carbon/icons-react';
import { useNavigateWithOrg } from '@/features/Core/hooks/use-navigate-with-org';
import { useStyletron } from 'baseui';
import { expandBorderStyles } from 'baseui/styles';
import { HeadingMedium } from 'baseui/typography';
import { useParams } from 'react-router-dom';

export function DashboardPage() {
  const intl = useIntl();
  const naviate = useNavigateWithOrg();

  const [css, $theme] = useStyletron();

  const params = useParams();

  return (
    <ContentWrapper
      noSidebar
      breadcrumb={[
        {
          title: intl.formatMessage({ defaultMessage: 'Anthaathi Admin' }),
          to: '/',
        },
      ]}
      toolbarTab={[
        {
          title: intl.formatMessage({ defaultMessage: 'Overview' }),
        },
      ]}
      center
      maxWidth="1200px"
      title={intl.formatMessage({ defaultMessage: 'Dashboard' })}
    >
      <Block maxWidth="1200px" margin="0 auto">
        <BadgeList $size={BadgeSize.SMALL}>
          {badges.map((badge) => (
            <BadgeListItem
              title={badge.title}
              key={badge.key}
              onClick={() => {
                naviate(badge.to);
              }}
            >
              {badge.icon}
            </BadgeListItem>
          ))}
        </BadgeList>

        <div
          className={css({
            marginTop: $theme.sizing.scale700,
            ...expandBorderStyles($theme.borders.border100),
          })}
        />

        <HeadingMedium marginTop="scale300" marginBottom="scale300">
          <FormattedMessage defaultMessage="Apps" />
        </HeadingMedium>

        <DataTableV2
          onClick={(item) => {
            if (item.id === 'esg' || item.id === 'task') {
              const [, ...host] = window.location.host.split('.');

              const url = window.open(
                `${window.location.protocol}//${[item.id, ...host].join(
                  '.',
                )}/o/${params.key}`,
                '_blank',
              );

              if (!url || url.closed || typeof url.closed == 'undefined') {
                alert(
                  intl.formatMessage({
                    defaultMessage:
                      'Popup blocked! Please enable popups for this site to continue.',
                  }),
                );
              }
            }
          }}
          data={[
            {
              title: 'ESG',
              id: 'esg',
              icon: <CarbonAccounting />,
            },
						{
							title: 'Tasks',
							id: 'task',
							icon: <Task/>
						}
          ]}
        />
      </Block>
    </ContentWrapper>
  );
}

const badges = [
  {
    title: <FormattedMessage defaultMessage="Users" />,
    key: 'users',
    to: '/user',
    icon: <User size={24} />,
  },
  {
    title: <FormattedMessage defaultMessage="Groups" />,
    key: 'groups',
    to: '/group',
    icon: <Group size={24} />,
  },
];
