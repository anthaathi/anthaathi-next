import * as React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import DynamicElements, {
	CardAction,
	CardContent,
	CardDivider,
	CardSubheading,
	DetailViewerActionVertMenu,
} from '.';
import DetailViewer from '.';
import { Block } from 'baseui/block';
import { GameWireless } from '@carbon/icons-react';

export default {
	title: 'Anthaathi/Admin/DetailViewer',
	component: DynamicElements,
	// More on argTypes: https://storybook.js.org/docs/react/api/argtypes
	argTypes: {},
} as Meta<typeof DynamicElements>;

const Template: StoryFn<typeof DynamicElements> = (args) => {
	return (
		<Block $style={{ margin: '1rem' }}>
			<DetailViewer children={<></>} {...args} />
		</Block>
	);
};

export const Primary = Template.bind({});

Primary.args = {
	title: 'Hello World',
	titleIcon: <GameWireless size={24 as never} />,
	action: <DetailViewerActionVertMenu items={[]} />,
	children: (
		<>
			<CardContent>Hello world</CardContent>
			<CardDivider />
			<CardSubheading>Omkar</CardSubheading>
			<CardAction>Hello world</CardAction>
		</>
	),
};
