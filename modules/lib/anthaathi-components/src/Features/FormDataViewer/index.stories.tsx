import { FormDataViewer } from './index';
import { Meta, StoryFn } from '@storybook/react';
import { FormBuilderV2 } from '../FormBuilderV2';

export default {
	title: 'Anthaathi/Admin/FormDataViewer',
	component: FormDataViewer,
	// More on argTypes: https://storybook.js.org/docs/react/api/argtypes
	argTypes: {
		schema: {
			type: 'string',
			defaultValue: {
				type: 'object',
			},
		},
	},
} as Meta<typeof FormDataViewer>;

const Template: StoryFn<typeof FormBuilderV2> = (args) => {
	return (
		<FormDataViewer
			pinnedCols={['title']}
			schema={{
				type: 'object',
				properties: {
					title: {
						type: 'string',
						title: 'Summary',
					},
				},
			}}
			data={{
				title: 'Hello',
				description: 'World',
			}}
		/>
	);
};

export const Primary = Template.bind({});
