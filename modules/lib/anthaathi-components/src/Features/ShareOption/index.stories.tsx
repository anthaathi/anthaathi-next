import { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import { ShareOption } from './index';

export default {
	title: 'Anthaathi/Admin/ShareOption',
	component: ShareOption,
	// More on argTypes: https://storybook.js.org/docs/react/api/argtypes
	argTypes: {},
} as Meta<typeof ShareOption>;

const Template: StoryFn<typeof ShareOption> = (args) => {
	return (
		<>
			<ShareOption
				title="Some file"
				subTitle={''}
				name="name"
				email="email"
				isOwner={''}
				options={[
					{ id: 'abc@gmail.com' },
					{ id: 'abc@gmail.com' },
					{ id: 'abc@gmail.com' },
					{ id: 'abc@gmail.com' },
					{ id: 'abc@gmail.com' },
					{ id: 'abc@gmail.com' },
				]}
				buttons={[
					{
						name: 'Copy link',
					},
					{
						name: 'Done',
					},
				]}
			/>
		</>
	);
};

export const Primary = Template.bind({});
