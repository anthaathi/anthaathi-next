import { Meta, StoryFn } from '@storybook/react';
import { CommentBadge, CommentBox } from '.';
import React from 'react';
import { Block } from 'baseui/block';
import { MarkdownEditor } from '../MarkdownEditor';
import { useStyletron } from 'baseui';
import { Button } from 'baseui/button';
import { Avatar } from 'baseui/avatar';
import { Home } from '@carbon/icons-react';

export default {
	title: 'Anthaathi/Admin/Timeline',
	component: CommentBox,
	// More on argTypes: https://storybook.js.org/docs/react/api/argtypes
	argTypes: {},
} as Meta<typeof CommentBox>;

const Template: StoryFn<typeof CommentBox> = (args) => {
	const [css] = useStyletron();

	return (
		<Block $style={{ margin: '1rem' }}>
			<div>
				<div className={css({ display: 'flex' })}>
					<div className={css({ padding: '10px' })}>
						<Avatar name="My User" />
					</div>

					<div className={css({ flexGrow: 1 })}>
						<MarkdownEditor value="" onChange={() => {}} />
					</div>
				</div>
				<div
					className={css({
						display: 'flex',
						flexDirection: 'row-reverse',
						marginTop: '12px',
					})}
				>
					<Button>Comment</Button>
				</div>

				<br />
				<CommentBox {...args} fullWidth={true} />
				<CommentBadge />
				<CommentBox {...args} fullWidth={true} />
				<CommentBadge icon={<Home />}>
					Lorem ipsum dolor sit amet, consectetur adipisicing elit.!
				</CommentBadge>
				<CommentBox fullWidth={true} {...args} />
				<CommentBadge icon={<Home />}>
					Lorem ipsum dolor sit amet, consectetur adipisicing elit.!
				</CommentBadge>
				<CommentBox fullWidth={true} {...args} />
			</div>
		</Block>
	);
};

export const Primary = Template.bind({});

Primary.args = {};
