import { Meta, StoryFn } from '@storybook/react';
import * as React from 'react';
import { Block } from 'baseui/block';
import { SplitColumnWidthAndDisplayOrder } from './split-column-width-and-display-order';
import { DataSource, DataSourceProvider } from '../../Datasource';
import { defaultSchema } from '../../FormBuilder/default-schema';
import { ConfigProvider } from '../context/use-datatable-context';
import { useMemo } from 'react';

export default {
	title: 'Anthaathi/Admin/Datatable/SplitColumnWidthAndDisplayOrder',
	component: SplitColumnWidthAndDisplayOrder,
	// More on argTypes: https://storybook.js.org/docs/react/api/argtypes
	argTypes: {},
} as Meta<typeof SplitColumnWidthAndDisplayOrder>;

const Template: StoryFn<typeof SplitColumnWidthAndDisplayOrder> = (args) => {
	const dataSource: Record<string, DataSource> = useMemo(() => {
		return {
			test: async (data) => {
				return await new Promise((resolve) => {
					setTimeout(() => {
						resolve([{ id: '1', label: 'Option 1', to: '/test' }]);
					}, 5000);
				});
			},
		};
	}, []);

	return (
		<Block $style={{ margin: '1rem' }}>
			<ConfigProvider>
				<DataSourceProvider dataSources={dataSource}>
					<SplitColumnWidthAndDisplayOrder schema={defaultSchema} />
				</DataSourceProvider>
			</ConfigProvider>
		</Block>
	);
};

export const Primary = Template.bind({});
