import { Meta, StoryFn } from '@storybook/react';
import { useMemo, useState } from 'react';
import { Block } from 'baseui/block';
import { ComposedFilter, Filter } from './filters';
import { defaultSchema } from '../FormBuilder/default-schema';
import { DataSource, DataSourceProvider } from '../Datasource';

export default {
	title: 'Anthaathi/Admin/Datatable/Filter',
	component: Filter,
	// More on argTypes: https://storybook.js.org/docs/react/api/argtypes
	argTypes: {},
} as Meta<typeof Filter>;

const filter: ComposedFilter = {
	$kind: 'and',
	and: [],
};

const Template: StoryFn<typeof Filter> = (args) => {
	const [_filters, setFilterInformation] = useState<ComposedFilter>(filter);
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
				<Filter
					filter={_filters}
					schema={defaultSchema}
					onChange={setFilterInformation}
					{...args}
				/>
			</DataSourceProvider>
		</Block>
	);
};

export const Primary = Template.bind({});

export const SimpleUI = Template.bind({
	simpleUI: true,
});
