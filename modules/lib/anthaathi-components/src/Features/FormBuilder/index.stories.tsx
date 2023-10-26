import { Meta, StoryFn } from '@storybook/react';
import FormBuilder from '.';
import React, { useMemo, useState } from 'react';
import { Block } from 'baseui/block';
import { DataSource, DataSourceProvider } from '../Datasource';
import { defaultSchema, layout } from './default-schema';
import { Checkbox } from 'baseui/checkbox';
import { STYLE_TYPE } from 'baseui/checkbox/constants';

export default {
	title: 'Anthaathi/Admin/FormBuilder',
	component: FormBuilder,
	// More on argTypes: https://storybook.js.org/docs/react/api/argtypes
	argTypes: {
		schema: defaultSchema,
		onSubmit: {
			action: 'onSubmit',
		},
	},
} as Meta<typeof FormBuilder>;

const Template: StoryFn<typeof FormBuilder> = (args) => {
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

	const [data, setData] = useState<boolean>();

	return (
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
				{/*
  // @ts-expect-error */}
				<FormBuilder schema={data ? defaultSchema : layout} {...args} />
			</DataSourceProvider>
		</Block>
	);
};

export const Primary = Template.bind({});
