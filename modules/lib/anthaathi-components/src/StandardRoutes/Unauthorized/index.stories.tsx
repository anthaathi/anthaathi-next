import { Meta, StoryFn } from '@storybook/react';
import Default from './index';
import * as React from 'react';
import { useStyletron } from 'baseui';

export default {
	title: 'Anthaathi/Admin/Layouts/Unauthorized',
	component: Default,
	// More on argTypes: https://storybook.js.org/docs/react/api/argtypes
	argTypes: {
		errorCode: {
			type: 'number',
			defaultValue: 404,
		},
		errorMessage: {
			type: 'string',
			defaultValue: "Sorry, you don't have access to this page.",
		},
	},
} as Meta<typeof Default>;

const Template: StoryFn<typeof Default> = (args) => {
	const [css] = useStyletron();

	return (
		<div
			className={css({
				height: '100vh',
			})}
		>
			<Default errorCode={0} errorMessage={''} {...args} />
		</div>
	);
};

export const Primary = Template.bind({});
