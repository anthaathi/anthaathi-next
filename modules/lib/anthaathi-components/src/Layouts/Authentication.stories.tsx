import { Meta, StoryFn } from '@storybook/react';
import Default from './Authentication';
import React from 'react';
import { useStyletron } from 'baseui';
import { Button, SIZE } from 'baseui/button';
import { HeadingMedium } from 'baseui/typography';
import { Form } from 'react-router-dom';
import { FormControl } from 'baseui/form-control';
import { Input } from 'baseui/input';

export default {
	title: 'Anthaathi/Admin/Layouts/AuthenticationLayout',
	component: Default,
	// More on argTypes: https://storybook.js.org/docs/react/api/argtypes
	argTypes: {
		children: {
			control: {
				type: 'text',
				defaultValue: 'Hello world',
			},
		},
	},
} as Meta<typeof Default>;

const Template: StoryFn<typeof Default> = (args) => {
	const [css, theme] = useStyletron();
	return (
		<Default {...args}>
			<div
				className={css({
					backgroundColor: '#FFF',
					width: '100%',
					marginTop: theme.sizing.scale1600,
				})}
			>
				<div
					className={css({
						padding: theme.sizing.scale800,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					})}
				>
					<HeadingMedium
						marginTop="scale500"
						marginBottom="scale500"
						$style={{ width: '100%' }}
					>
						Log in to your Red Hat account
					</HeadingMedium>

					<Form className={css({ width: '100%' })}>
						<FormControl label="Username or Email">
							<Input overrides={{ Root: { style: { width: '100%' } } }} />
						</FormControl>
					</Form>

					<Button
						size={SIZE.compact}
						overrides={{
							Root: { style: { width: 'calc(100%)', marginTop: '24px' } },
						}}
					>
						Next
					</Button>
				</div>

				<div></div>
			</div>
		</Default>
	);
};

export const Primary = Template.bind({
	children: <>Omkar</>,
});
