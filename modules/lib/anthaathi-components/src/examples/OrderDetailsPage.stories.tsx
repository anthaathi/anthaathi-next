import { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import { Block } from 'baseui/block';
import DefaultLayout from '../Layouts/Default';
import { DataSourceProvider, DataSources } from '../Features/Datasource';
import { CircleDash, User } from '@carbon/icons-react';
import ContentWrapper from '../Features/Layout/ContentWrapper';
import { Button, SIZE } from 'baseui/button';
import { useStyletron } from 'baseui';
import {
	TaskMetaData,
	TaskMetaDataItem,
	TaskTable,
	TaskTableData,
} from '../Features/TaskMetaData';
import AvatarStack from '../Features/AvatarStack';
import DetailViewerCard, {
	CardAction,
	CardContent,
	CardDivider,
} from '../Features/DetailViewer';
import { Cell, Grid } from 'baseui/layout-grid';
import { LabelMedium, ParagraphMedium } from 'baseui/typography';
import { StyledLink } from 'baseui/link';
import { Avatar } from 'baseui/avatar';
import { MarkdownEditor } from '../Features/MarkdownEditor';
import { CommentBadge, CommentBox } from '../Features/Timeline';
import { TimelineItemBreak } from '../Features/Timeline/Components/TimelineItem';
import { defaultLayoutItems } from './data';

export default {
	title: 'Anthaathi/Admin/Examples/OrdersDetailsPage',
	component: DefaultLayout,
	// More on argTypes: https://storybook.js.org/docs/react/api/argtypes
	argTypes: {},
} as Meta<typeof DefaultLayout>;

const datasource: DataSources = {
	search: async () => {
		return await Promise.resolve({
			items: [],
			total: 0,
		});
	},
};

const Template: StoryFn<typeof DefaultLayout> = (args) => {
	const [css] = useStyletron();

	return (
		<Block>
			<div {...args}>
				<DataSourceProvider dataSources={datasource}>
					<DefaultLayout
						items={defaultLayoutItems}
						pageTitle="Order | Anthaathi"
					>
						<ContentWrapper
							breadcrumb={[
								{
									title: 'Dashboard',
									to: '/',
								},
								{
									title: 'Orders',
									to: '/orders',
								},
							]}
							toolbarTab={[
								{
									title: 'Details',
									isActive: true,
								},
							]}
							toolbarActions={<Button size={SIZE.compact}>Action</Button>}
							title="Order #123"
							fullWidth={false}
						>
							<div
								className={css({
									width: 'calc(100% - 12px)',
									maxWidth: '1300px',
								})}
							>
								<Grid gridMaxWidth={0} gridMargins={0} gridGaps={0}>
									<Cell span={8}>
										<DetailViewerCard
											title="Unfulfilled (2)"
											titleIcon={<CircleDash />}
										>
											<CardContent>
												<TaskTable>
													<>
														<TaskTableData>Product item</TaskTableData>
														<TaskTableData align="right">
															2 x{' '}
															{Intl.NumberFormat('en', {
																style: 'currency',
																currency: 'AED',
															}).format(100)}
														</TaskTableData>
														<TaskTableData align="right">
															{Intl.NumberFormat('en', {
																style: 'currency',
																currency: 'AED',
															}).format(200)}
														</TaskTableData>
													</>
													<>
														<TaskTableData>Product item</TaskTableData>
														<TaskTableData align="right">
															2 x{' '}
															{Intl.NumberFormat('en', {
																style: 'currency',
																currency: 'AED',
															}).format(100)}
														</TaskTableData>
														<TaskTableData align="right">
															{Intl.NumberFormat('en', {
																style: 'currency',
																currency: 'AED',
															}).format(200)}
														</TaskTableData>
													</>
												</TaskTable>
											</CardContent>
											<CardDivider />
											<CardAction>
												<span className={css({ flexGrow: 1 })} />
												<Button size={SIZE.compact}>Fullfill items</Button>
											</CardAction>
										</DetailViewerCard>

										<div className={css({ marginBottom: '24px' })} />

										<DetailViewerCard title="Paid">
											<CardContent>
												<TaskTable>
													<>
														<TaskTableData>Subtotal</TaskTableData>
														<TaskTableData>2 Items</TaskTableData>
														<TaskTableData align="right">
															{Intl.NumberFormat('en', {
																style: 'currency',
																currency: 'AED',
															}).format(299.0)}
														</TaskTableData>
													</>
													<>
														<TaskTableData
															colSpan={2}
															$style={{ fontWeight: 600 }}
														>
															Total
														</TaskTableData>
														<TaskTableData
															align="right"
															$style={{ fontWeight: 600 }}
														>
															{Intl.NumberFormat('en', {
																style: 'currency',
																currency: 'AED',
															}).format(299.0)}
														</TaskTableData>
													</>
												</TaskTable>
											</CardContent>
											<CardDivider />
											<CardAction $style={{ marginTop: '10px' }}>
												<TaskTable>
													<>
														<TaskTableData>Paid by customer</TaskTableData>
														<TaskTableData align="right">
															{Intl.NumberFormat('en', {
																style: 'currency',
																currency: 'AED',
															}).format(299)}
														</TaskTableData>
													</>
												</TaskTable>
											</CardAction>
										</DetailViewerCard>

										<div className={css({ marginBottom: '24px' })} />

										<div className={css({ padding: '12px' })}>
											<LabelMedium>Timeline</LabelMedium>
										</div>

										<CardDivider />

										<div className={css({ paddingBottom: '12px' })} />

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
											<Button size={SIZE.compact}>Comment</Button>
										</div>

										<br />
										<CommentBox fullWidth={true} />
										<CommentBadge />
										<CommentBox fullWidth={true} />
										<CommentBadge />
										<CommentBox fullWidth={true} />
										<CommentBadge />
										<CommentBox fullWidth={true} />
										<CommentBadge />
										<TimelineItemBreak />
									</Cell>
									<Cell span={4}>
										<Grid gridMaxWidth={0} gridMargins={0} gridGaps={12}>
											<Cell span={12}>
												<DetailViewerCard
													title="Notes"
													action={<StyledLink href="#">Edit</StyledLink>}
												>
													<CardContent>
														<ParagraphMedium marginTop={0} marginBottom={0}>
															No notes from customer
														</ParagraphMedium>
													</CardContent>
													<CardAction />
												</DetailViewerCard>
											</Cell>
											<Cell span={12}>
												<DetailViewerCard>
													<CardContent />
													<CardContent>
														<Grid gridMaxWidth={0} gridMargins={0}>
															<Cell span={12}>
																<TaskMetaData span={12} gaps={24}>
																	<TaskMetaDataItem title="Order Date">
																		<LabelMedium>12/12/2020</LabelMedium>
																	</TaskMetaDataItem>

																	<CardDivider />

																	<TaskMetaDataItem title="Order Date">
																		<LabelMedium>12/12/2020</LabelMedium>
																	</TaskMetaDataItem>
																</TaskMetaData>
															</Cell>
														</Grid>
													</CardContent>
												</DetailViewerCard>
											</Cell>
											<Cell span={12}>
												<DetailViewerCard title="Assigned" titleIcon={<User />}>
													<CardContent>
														<TaskMetaData
															span={12}
															gaps={18}
															children={[
																<TaskMetaDataItem key={1} title="Foreman">
																	<AvatarStack
																		canAssign={true}
																		align="start"
																		items={[
																			{ title: 'John Doe', key: 'item1' },
																			{ title: 'Jane Doe', key: 'item2' },
																		]}
																	/>
																</TaskMetaDataItem>,
																<TaskMetaDataItem key={2} title="Driver">
																	<AvatarStack
																		canAssign={true}
																		align="start"
																		items={[
																			{ title: 'John Doe', key: 'item1' },
																			{ title: 'Jane Doe', key: 'item2' },
																		]}
																	/>
																</TaskMetaDataItem>,
																<TaskMetaDataItem key={3} title="Foreman">
																	<AvatarStack
																		canAssign={true}
																		align="start"
																		items={[
																			{ title: 'John Doe', key: 'item1' },
																			{ title: 'Jane Doe', key: 'item2' },
																		]}
																	/>
																</TaskMetaDataItem>,
																<TaskMetaDataItem key={4} title="Picker">
																	<AvatarStack
																		canAssign={true}
																		align="start"
																		items={[
																			{
																				tooltip: 'Assign Picker',
																				title: 'John Doe',
																				key: 'assign-picker',
																			},
																			{ title: 'John Doe', key: 'item1' },
																			{ title: 'Jane Doe', key: 'item2' },
																		]}
																	/>
																</TaskMetaDataItem>,
															]}
														/>
													</CardContent>
												</DetailViewerCard>
											</Cell>
										</Grid>
									</Cell>
								</Grid>
							</div>
						</ContentWrapper>
					</DefaultLayout>
				</DataSourceProvider>
			</div>
		</Block>
	);
};

export const Primary = Template.bind({});

Primary.args = {};
