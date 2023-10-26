import { Meta, StoryFn } from '@storybook/react';
import Header from './index';
import React from 'react';
import { DataSourceProvider, DataSources } from '../Datasource';
import { Logout } from '@carbon/icons-react';

export default {
	title: 'Anthaathi/Admin/Header',
	component: Header,
	// More on argTypes: https://storybook.js.org/docs/react/api/argtypes
	argTypes: {},
} as Meta<typeof Header>;

const datasource: DataSources = {
	search: async () =>
		await Promise.resolve({
			total: 1,
			items: [
				{
					id: '1',
					label: 'Test',
				},
			],
		}),
};

const Template: StoryFn<typeof Header> = (args) => (
	<DataSourceProvider dataSources={datasource}>
		<Header
			profileProps={{ items: [], onItemClick: () => {} }}
			title=""
			{...args}
		/>
	</DataSourceProvider>
);

export const Primary = Template.bind({});

Primary.args = {
	profileProps: {
		items: [
			{
				title: 'Logout',
				icon: <Logout />,
				key: 'logout',
			},
		],
		onItemClick: () => {},
	},
};
