/*
 * Copyright (c) Anthaathi Private Limited 2022.
 *
 * This code is the exclusive property of Anthaathi Private Limited and is protected by copyright and intellectual property laws.
 * Any unauthorized use, reproduction, distribution, or modification of this code is strictly prohibited.
 *
 * Anthaathi Private Limited reserves all rights in and to this code and will vigorously defend its intellectual property rights.
 */

import { ToolbarTabItemData } from '../Features/Layout/ContentWrapper';
import { Add } from '@carbon/icons-react';

export const taskDetails: ToolbarTabItemData[] = [
	{
		title: 'Activities',
		isActive: true,
		to: '/',
	},
	{
		title: (
			<>
				<Add /> Add new
			</>
		),
		children: [
			{
				title: 'Views',
				onClick: () => {},
			},
		],
	},
];
