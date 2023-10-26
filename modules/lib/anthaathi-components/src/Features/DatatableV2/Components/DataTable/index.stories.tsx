import { Meta, StoryFn } from '@storybook/react';
import { DataTable } from './index';
import { Button, SIZE } from 'baseui/button';
import { Printer } from '@carbon/icons-react';
import * as React from 'react';
export default {
	title: 'Anthaathi/Admin/DatatableV2',
	component: DataTable,
	// More on argTypes: https://storybook.js.org/docs/react/api/argtypes
	argTypes: {},
} as Meta<typeof DataTable>;

const d = <Printer />;

const Template: StoryFn<typeof DataTable> = (args) => {
	return (
		<>
			<DataTable
				data={[
					{
						id: 'Omkar1',
						title: 'Omkar Yadav',
					},
					{
						id: 'Omkar2',
						title: 'Omkar Yadav',
					},
					{
						id: 'Omkar3',
						title: 'Omkar Yadav',
					},
					{
						id: 'Omkar4',
						title: 'Omkar Yadav',
					},
					{
						id: 'Omkar5',
						title: 'Omkar Yadav',
						array: [
							{
								label: 'Omkar',
							},
						],
					},
				]}
				actions={[
					{
						label: 'Edit',
						key: 'edit',
					},
				]}
				schema={{
					type: 'object',
					properties: {
						title: {
							type: 'string',
							title: 'A1',
							align: 'center',
						},
						description: {
							type: 'string',
							title: 'A2',
							align: 'center',
						},
						array: {
							type: 'array',
							title: 'A3',
							dataSource: {
								type: 'static',
								values: [
									{
										label: 'Omkar',
										id: 'Omkar',
									},
									{
										label: 'Yadav',
										id: 'Yadav',
									},
								],
							},
							items: {
								type: 'object',
								title: 'Array',
								properties: {
									label: {
										type: 'string',
										title: 'Label',
									},
									id: {
										type: 'string',
										title: 'ID',
									},
								},
							},
						},
					},
				}}
				defaultIcon={d}
				onClick={console.log}
				actionButton={<Button size={SIZE.compact}>Create action</Button>}
			/>
		</>
	);
};

export const Primary = Template.bind({});
