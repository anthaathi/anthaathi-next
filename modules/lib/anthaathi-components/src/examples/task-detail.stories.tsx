/*
 * Copyright (c) Anthaathi Private Limited 2022.
 *
 * This code is the exclusive property of Anthaathi Private Limited and is protected by copyright and intellectual property laws.
 * Any unauthorized use, reproduction, distribution, or modification of this code is strictly prohibited.
 *
 * Anthaathi Private Limited reserves all rights in and to this code and will vigorously defend its intellectual property rights.
 */

import { Meta, StoryFn } from '@storybook/react';
import DefaultLayout from '../Layouts/Default';
import ContentWrapper from '../Features/Layout/ContentWrapper';
import { DataSourceProvider } from '../Features/Datasource';
import { defaultLayoutItems } from './data';
import { taskDetails } from './task-details';
import { Block } from 'baseui/block';
import { styled, useStyletron } from 'baseui';
import { Button, SHAPE, SIZE } from 'baseui/button';
import {
	CheckboxChecked,
	DocumentAttachment,
	Link,
	OverflowMenuVertical,
	Settings,
	UserAdmin,
} from '@carbon/icons-react';
import { Card, CardContent, CardTitle } from '../Features/DetailViewer';
import * as React from 'react';
import { MarkdownEditor } from '../Features/MarkdownEditor';
import {
	CommentBadge,
	CommentBox,
	TimelineItemBreak,
} from '../Features/Timeline';
import { Avatar } from 'baseui/avatar';
import { RenderFacetBuilder } from '../Features/FacetBuilder/Components/RenderFacetBuilder';

export default {
	title: 'Anthaathi/Admin/Examples/TaskDetail',
	component: DefaultLayout,
	// More on argTypes: https://storybook.js.org/docs/react/api/argtypes
	argTypes: {},
} as Meta<typeof DefaultLayout>;

const Template: StoryFn<typeof DefaultLayout> = () => {
	const [, $theme] = useStyletron();

	return (
		<DataSourceProvider dataSources={{}}>
			<DefaultLayout items={defaultLayoutItems}>
				<ContentWrapper
					maxWidth="1600px"
					breadcrumb={[
						{
							title: 'Toolbar',
						},
					]}
					center={true}
					toolbarTab={taskDetails}
					title="Task details"
					fullWidth={false}
					toolbarActions={
						<Block>
							<Block display={['flex', 'flex', 'none']}>
								<Button
									size={SIZE.compact}
									shape={SHAPE.pill}
									kind="secondary"
									startEnhancer={<OverflowMenuVertical />}
								>
									More
								</Button>
							</Block>
							<Block display={['none', 'none', 'flex']} alignContent="center">
								<Span />

								<Button
									shape={SHAPE.pill}
									startEnhancer={<DocumentAttachment />}
									kind="secondary"
									size={SIZE.compact}
								>
									Attach
								</Button>
								<Span />
								<Button
									shape={SHAPE.pill}
									size={SIZE.compact}
									kind="secondary"
									startEnhancer={<CheckboxChecked />}
								>
									Create subtask
								</Button>
								<Span />
								<Button
									shape={SHAPE.pill}
									size={SIZE.compact}
									kind="secondary"
									startEnhancer={<Link />}
								>
									Link Issue
								</Button>
								<Span />
								<Button
									size={SIZE.compact}
									shape={SHAPE.pill}
									kind="secondary"
									startEnhancer={<OverflowMenuVertical />}
								>
									More
								</Button>
							</Block>
						</Block>
					}
				>
					<Block
						maxWidth="1600px"
						display="flex"
						flexDirection={['column', 'column', 'row', 'row']}
						marginTop="scale400"
						marginLeft="auto"
						marginRight="auto"
					>
						<Block
							$style={{
								flexGrow: 1,
								[$theme.mediaQuery.medium]: {
									marginRight: '12px',
								},
							}}
						>
							<CommentBox
								fullWidth={true}
								title={
									<>
										<Avatar name="Omkar Yadav" size="scale900" />
										<Block width="6px" />
										Omkar Yadav
									</>
								}
								subTitle="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque beatae consequuntur cum cumque distinctio et, fuga, harum maiores minus modi numquam perferendis possimus quis sed sunt tempore unde, veritatis vitae."
							/>

							<CommentBadge icon={<UserAdmin />}>I m crazy</CommentBadge>

							<TimelineItemBreak />

							<Block paddingTop="scale600">
								<MarkdownEditor value="" onChange={() => {}} />

								<Block
									alignItems="center"
									placeItems="center"
									marginTop="scale200"
									display="flex"
								>
									<FlexFill />
									<Button size={SIZE.default}>Comment</Button>
								</Block>
							</Block>
						</Block>
						<Block
							width={['100%', '100%', '440px', '440px']}
							marginTop={['scale200', 'scale200', 0]}
						>
							<Card
								$style={{
									width: '100%',
									boxShadow: 'none',
									border: '1px solid #EEE',
								}}
							>
								<RenderFacetBuilder
									size="large"
									data={{}}
									schema={{
										properties: {
											section1: {
												type: 'date-time',
												title: 'Due date',
											},
											assignedUser: {
												type: 'assign-user',
												title: 'Assign user',
											},
											time: {
												type: 'time',
												title: 'Time',
											},
											select: {
												type: 'select',
												title: 'Select',
												enum: [],
											},
										},
									}}
								/>
							</Card>

							<Card
								$style={{
									width: '100%',
									marginTop: '12px',
									boxShadow: 'none',
									border: '1px solid #EEE',
								}}
							>
								<CardTitle>Other fields</CardTitle>
								<CardContent>
									<RenderFacetBuilder
										data={{}}
										schema={{
											properties: {
												section1: {
													type: 'date-time',
													title: 'Due date',
												},
												assignedUser: {
													type: 'assign-user',
													title: 'Assign user',
												},
												time: {
													type: 'time',
													title: 'Time',
												},
												select: {
													type: 'select',
													title: 'Select',
													enum: [],
												},
											},
										}}
									/>
								</CardContent>
							</Card>

							<Block display="flex" marginTop="scale200">
								<FlexFill />
								<Button
									kind="tertiary"
									startEnhancer={<Settings />}
									size={SIZE.mini}
								>
									Configure
								</Button>
							</Block>
						</Block>
					</Block>
				</ContentWrapper>
			</DefaultLayout>
		</DataSourceProvider>
	);
};

const Span = styled('div', {
	width: '6px',
});

const FlexFill = styled('div', {
	flexGrow: 1,
});

export const Primary = Template.bind({});

Primary.args = {};
