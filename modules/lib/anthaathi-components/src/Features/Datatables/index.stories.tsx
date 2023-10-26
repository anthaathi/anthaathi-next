import { Meta, StoryFn } from '@storybook/react';
import { Block } from 'baseui/block';
import { useMemo } from 'react';
import DataTable from '.';
import { DataSource, DataSourceProvider } from '../Datasource';
import {
	defaultSchema,
	layout,
	layoutData,
} from '../FormBuilder/default-schema';
import { ConfigProvider } from './context/use-datatable-context';

export default {
	title: 'Anthaathi/Admin/Datatable',
	component: DataTable,
	// More on argTypes: https://storybook.js.org/docs/react/api/argtypes
	argTypes: {},
} as Meta<typeof DataTable>;

const newSchema = {
	...defaultSchema,
};

newSchema.properties.firstName.sortable = true;

const Template: StoryFn<typeof DataTable> = (args) => {
	const dataSource: Record<string, DataSource> = useMemo(() => {
		return {
			test: async (data) => {
				return await new Promise((resolve) => {
					setTimeout(() => {
						resolve([{ id: '1', label: 'Option 1' }]);
					}, 5000);
				});
			},
		};
	}, []);

	return (
		<Block $style={{ margin: '1rem' }}>
			<DataSourceProvider dataSources={dataSource}>
				<ConfigProvider>
					<DataTable
						schema={{ properties: {} }}
						data={[]}
						selectable={true}
						actions={[
							{
								label: 'Edit',
								actionId: 'edit',
							},
						]}
						onAction={(actionId) => {
							console.log(actionId);
						}}
						{...args}
					/>
				</ConfigProvider>
			</DataSourceProvider>
		</Block>
	);
};

export const Primary = Template.bind({});

Primary.args = {
	schema: newSchema,
	data: [
		{
			id: 'test',
			firstName: 'John',
			lastName: 'Doe',
			email: 'john@gmail.com',
			password: '',
		},
	],
};

export const DifferentSchema = Template.bind({});

DifferentSchema.args = {
	schema: layout,
	data: layoutData,
};
