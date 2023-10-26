import { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import { Block } from 'baseui/block';
import AvatarStack from './index';

export default {
	title: 'Anthaathi/Admin/AvatarStack',
	component: AvatarStack,
	// More on argTypes: https://storybook.js.org/docs/react/api/argtypes
	argTypes: {},
} as Meta<typeof AvatarStack>;

const Template: StoryFn<typeof AvatarStack> = (args) => {
	return (
		<Block $style={{ margin: '1rem' }}>
			<AvatarStack items={[]} {...args} />
		</Block>
	);
};

export const Primary = Template.bind({});

Primary.args = {
	align: 'start',
	onClick: () => {},
	items: [
		{
			title: 'John Doe',
			img: 'https://i.pravatar.cc/300',
			key: '1',
		},
		{
			title: 'Jane Doe',
			img: 'https://i.pravatar.cc/300',
			key: '2',
		},
		{
			title: 'John Doe',
			img: 'https://i.pravatar.cc/300',
			key: '3',
		},
		{
			title: 'Jane Doe',
			img: 'https://i.pravatar.cc/300',
			key: '4',
		},
		{
			title: 'John Doe',
			img: 'https://i.pravatar.cc/300',
			key: '5',
		},
		{
			title: 'Jane Doe',
			img: 'https://i.pravatar.cc/300',
			key: '6',
		},
		{
			title: 'John Doe',
			img: 'https://i.pravatar.cc/300',
			key: '7',
		},
		{
			title: 'Jane Doe',
			img: 'https://i.pravatar.cc/300',
			key: '8',
		},
	],
};
