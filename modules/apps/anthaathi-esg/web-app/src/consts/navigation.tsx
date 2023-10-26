import { SidebarItemData } from '@anthaathi/components';
import { useIntl } from 'react-intl';
import {
  Archive,
  AssetView,
  Home,
  OrderDetails,
  Report,
  ScisTransparentSupply,
  Settings,
  Task,
  TrafficIncident,
  User,
  WhitePaper,
} from '@carbon/icons-react';
import React from 'react';
import { useParams } from 'react-router-dom';

export const useSidebarItems: () => SidebarItemData[] = () => {
  const { orgKey } = useParams();
  const intl = useIntl();

  const org = window.location.pathname.split('/')[2];

  const baseTaskUrl = `${
    window.location.protocol
  }//${window.location.host.replace('esg', 'task')}/o/${org}`;

  return (
    [
      {
        key: 'home',
        type: 'item',
        to: '/',
        icon: <Home />,
        label: intl.formatMessage({ defaultMessage: 'Home' }),
      },
      {
        key: 'orders',
        icon: <OrderDetails />,
        type: 'item',
        to: '/order',
        label: intl.formatMessage({ defaultMessage: 'Orders' }),
      },
      {
        key: 'clients',
        type: 'item',
        icon: <User />,
        to: `${baseTaskUrl}/customer?key=client&return-url=${encodeURIComponent(
          window.location.href,
        )}`,
        label: intl.formatMessage({ defaultMessage: 'Clients' }),
      },
      {
        key: 'assessments',
        type: 'item',
        to: `${baseTaskUrl}/tasks?key=${encodeURIComponent(
          'assessments',
        )}&return-url=${encodeURIComponent(window.location.href)}`,
        icon: <AssetView />,
        label: intl.formatMessage({ defaultMessage: 'Assessments' }),
      },
      {
        key: 'suppliers',
        icon: <ScisTransparentSupply />,
        type: 'item',
        to: `${baseTaskUrl}/customer?key=supplier&return-url=${encodeURIComponent(
          window.location.href,
        )}`,
        label: intl.formatMessage({ defaultMessage: 'Suppliers' }),
      },
      {
        icon: <TrafficIncident />,
        key: 'incidents',
        type: 'item',
        to: `${baseTaskUrl}/tasks?key=${encodeURIComponent(
          'incident',
        )}&return-url=${encodeURIComponent(window.location.href)}`,
        label: intl.formatMessage({ defaultMessage: 'Incidents' }),
      },
      {
        icon: <Task />,
        key: 'tasks',
        to: `${baseTaskUrl}/tasks`,
        type: 'item',
        label: intl.formatMessage({ defaultMessage: 'Tasks' }),
      },
      {
        key: 'reporting',
        type: 'item',
        to: '/reporting',
        icon: <Report />,
        label: intl.formatMessage({ defaultMessage: 'Reporting' }),
      },
      {
        type: 'spacer',
        label: 'spacer',
        key: 'spacer',
      },
      {
        key: 'Settings',
        type: 'accordion',
        items: [
          {
            key: 'general',
            type: 'item',
            label: intl.formatMessage({ defaultMessage: 'General' }),
          },
          {
            icon: <WhitePaper />,
            key: 'forms',
            type: 'item',
            label: intl.formatMessage({ defaultMessage: 'Forms' }),
          },
          {
            key: 'documents',
            icon: <Archive />,
            type: 'item',
            label: intl.formatMessage({ defaultMessage: 'Documents' }),
          },
        ],
        icon: <Settings />,
        label: intl.formatMessage({ defaultMessage: 'Settings' }),
      },
    ] as SidebarItemData[]
  ).map((res) => {
    return res.to && res.to.startsWith('/')
      ? {
          ...res,
          to: '/o/' + orgKey + res.to,
        }
      : res;
  });
};
