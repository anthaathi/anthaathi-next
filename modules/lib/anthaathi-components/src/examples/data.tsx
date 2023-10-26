import { SidebarItemData } from '../Features/Sidebar';
import { CarbonForIbmProduct, ShoppingCart } from '@carbon/icons-react';
import React from 'react';

export const defaultLayoutItems: SidebarItemData[] = [
	{
		label: 'Dashboard',
		type: 'section',
		key: 'dashboard',
	},
	{
		type: 'item',
		icon: <ShoppingCart />,
		to: '/orders',
		label: 'Orders',
		key: 'orders',
	},
	{
		key: 'products',
		type: 'item',
		label: 'Products',
		icon: <CarbonForIbmProduct />,
		to: '/products',
	},
	{
		key: 'tasks',
		type: 'item',
		label: 'Task',
		icon: <CarbonForIbmProduct />,
		to: '/task',
	},
];
