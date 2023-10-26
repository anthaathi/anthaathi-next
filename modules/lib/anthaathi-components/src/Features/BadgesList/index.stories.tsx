import { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import { Block } from 'baseui/block';
import { defaultSchema } from '../FormBuilder/default-schema';
import { BadgeList, BadgeListItem, BadgeSize, Container } from './index';
import { colors } from 'baseui/tokens';

export default {
	title: 'Anthaathi/Admin/BadgeList',
	component: Container,
	// More on argTypes: https://storybook.js.org/docs/react/api/argtypes
	argTypes: {},
} as Meta<typeof Container>;

const newSchema = {
	...defaultSchema,
};

newSchema.properties.firstName.sortable = true;

const Template: StoryFn<typeof Container> = (args) => {
	return (
		<Block $style={{ margin: '1rem' }}>
			<BadgeList $size={BadgeSize.WIDE}>
				<BadgeListItem title="Active User" color={colors.purple700}>
					100
				</BadgeListItem>
				<BadgeListItem title="Online User" color={colors.green600}>
					100
				</BadgeListItem>
				<BadgeListItem title="Offline User" color={colors.yellow600}>
					100
				</BadgeListItem>
			</BadgeList>
			<br />
			<BadgeList $size={BadgeSize.SMALL}>
				<BadgeListItem color={colors.green600} title="Pending orders">
					100
				</BadgeListItem>
				<BadgeListItem color={colors.green600} title="Failed orders">
					100
				</BadgeListItem>
				<BadgeListItem color={colors.green600} title="Completed orders">
					100
				</BadgeListItem>
				<BadgeListItem color={colors.green600} title="Cancelled orders">
					100
				</BadgeListItem>
				<BadgeListItem color={colors.green600} title="Total orders">
					100
				</BadgeListItem>
			</BadgeList>
			<br />
			<BadgeList $size={BadgeSize.DEFAULT}>
				<BadgeListItem title="User" color={colors.blue400}>
					100
				</BadgeListItem>
			</BadgeList>
		</Block>
	);
};

export const Primary = Template.bind({});
