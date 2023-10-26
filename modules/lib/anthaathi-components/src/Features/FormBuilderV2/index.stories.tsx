import { Meta, StoryFn } from '@storybook/react';
import * as React from 'react';
import { useMemo, useState } from 'react';
import { Block } from 'baseui/block';
import { DataSource, DataSourceProvider } from '../Datasource';
import { Checkbox } from 'baseui/checkbox';
import { STYLE_TYPE } from 'baseui/checkbox/constants';
import { FormBuilderV2 } from './index';

export default {
	title: 'Anthaathi/Admin/FormBuilderV2',
	component: FormBuilderV2,
	// More on argTypes: https://storybook.js.org/docs/react/api/argtypes
	argTypes: {
		schema: {
			type: 'string',
			defaultValue: {
				type: 'object',
			},
		},
	},
} as Meta<typeof FormBuilderV2>;

const Template: StoryFn<typeof FormBuilderV2> = (args) => {
	const dataSource: Record<string, DataSource> = useMemo(() => {
		return {
			test: async (data) => {
				return await new Promise((resolve) => {
					setTimeout(() => {
						resolve([{ id: '1', label: 'Option 1' }]);
					}, 1000);
				});
			},
		};
	}, []);

	const [data, setData] = useState<boolean>();

	const [, setState] = useState({});

	return (
		<>
			<Block
				maxWidth="1200px"
				$style={{ marginLeft: 'auto', marginRight: 'auto' }}
			>
				<Checkbox
					checked={data}
					onChange={(e) => setData(e.target.checked)}
					checkmarkType={STYLE_TYPE.toggle_round}
				>
					{!data ? 'Default schema' : 'Layout'}
				</Checkbox>

				<DataSourceProvider dataSources={dataSource}>
					<FormBuilderV2
						onChange={setState}
						schema={{
							type: 'object',
							properties: {
								items: {
									title: 'Form Item',
									type: 'array',
									items: {
										oneOf: [
											{ $ref: '#/definitions/string' },
											{ $ref: '#/definitions/boolean' },
											{ $ref: '#/definitions/array' },
											{ $ref: '#/definitions/object' },
											{ $ref: '#/definitions/number' },
										],
									},
								},
							},
							$defs: {
								string: {
									type: 'object',
									collapsedItems: [],
									properties: {
										type: {
											const: 'string',
											title: 'String',
										},
										title: {
											type: 'string',
											title: 'Title',
										},
									},
								},
								boolean: {
									type: 'object',
									properties: {
										type: {
											const: 'type',
											title: 'Boolean',
										},
									},
								},
								array: {
									type: 'object',
									properties: {
										type: {
											const: 'array',
											title: 'Array',
										},
									},
								},
								object: {
									type: 'object',
									properties: {
										type: {
											title: 'Object',
											const: 'object',
										},
									},
								},
								number: {
									type: 'object',
									properties: {
										type: {
											title: 'Number',
											const: 'number',
										},
									},
								},
							},
						}}
					/>
				</DataSourceProvider>
			</Block>
		</>
	);
};

export const Primary = Template.bind({});
