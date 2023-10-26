import DefaultLayout from '../Layouts/Default';
import { Meta, StoryFn } from '@storybook/react';
import { DataSourceProvider, DataSources } from '../Features/Datasource';
import { defaultLayoutItems } from './data';
import ContentWrapper from '../Features/Layout/ContentWrapper';
import DetailViewerCard, {
	CardAction,
	CardContent,
	CardDivider,
} from '../Features/DetailViewer';
import { Cell, Grid } from 'baseui/layout-grid';
import {
	TaskMetaData,
	TaskMetaDataItem,
	TaskTable,
	TaskTableData,
} from '../Features/TaskMetaData';
import { Button, SIZE } from 'baseui/button';
import {
	HeadingSmall,
	LabelMedium,
	LabelXSmall,
	ParagraphMedium,
} from 'baseui/typography';
import { Avatar } from 'baseui/avatar';
import { MarkdownEditor } from '../Features/MarkdownEditor';
import { CommentBadge, CommentBox } from '../Features/Timeline';
import { TimelineItemBreak } from '../Features/Timeline';
import { StyledLink } from 'baseui/link';
import React from 'react';
import { Badge, COLOR } from 'baseui/badge';
import { useStyletron } from 'baseui';
import { Link } from 'react-router-dom';

export default {
	title: 'Anthaathi/Admin/Examples/CustomerInfo',
	component: DefaultLayout,
	// More on argTypes: https://storybook.js.org/docs/react/api/argtypes
	argTypes: {},
} as Meta<typeof DefaultLayout>;

const dataSource: DataSources = {};

const Template: StoryFn<typeof DefaultLayout> = () => {
	const [css, $theme] = useStyletron();

	return (
		<DataSourceProvider dataSources={dataSource}>
			<DefaultLayout items={defaultLayoutItems} pageTitle="Customer">
				<ContentWrapper
					breadcrumb={[
						{
							title: 'Dashboard',
							to: '/',

						},
					]}
					toolbarTab={[
						{
							title: 'Dashboard',
							isActive: true,
						},
						{
							title: 'Orders',
						},
					]}
					title="Customer"
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
								<DetailViewerCard>
									<CardContent>
										<div
											className={css({
												display: 'flex',
												width: '100%',
												paddingTop: $theme.sizing.scale600,
												paddingBottom: $theme.sizing.scale600,
												alignItems: 'center',
												placeContent: 'center',
											})}
										>
											<div
												className={css({
													flexGrow: 1,
													display: 'flex',
													flexDirection: 'column',
													alignItems: 'start',
												})}
											>
												<LabelMedium>Amount spent</LabelMedium>
												<HeadingSmall
													$style={{ marginTop: 0, marginBottom: 0 }}
												>
													{Intl.NumberFormat('en', {
														currency: 'AED',
														style: 'currency',
													}).format(12)}
												</HeadingSmall>
											</div>
											<div
												className={css({
													flexGrow: 1,
													display: 'flex',
													flexDirection: 'column',
													alignItems: 'start',
												})}
											>
												<LabelMedium>Amount spent</LabelMedium>
												<HeadingSmall
													$style={{ marginTop: 0, marginBottom: 0 }}
												>
													{Intl.NumberFormat('en', {
														currency: 'AED',
														style: 'currency',
													}).format(12)}
												</HeadingSmall>
											</div>
											<div
												className={css({
													flexGrow: 1,
													display: 'flex',
													flexDirection: 'column',
													alignItems: 'start',
												})}
											>
												<LabelMedium>Amount spent</LabelMedium>
												<HeadingSmall
													$style={{ marginTop: 0, marginBottom: 0 }}
												>
													{Intl.NumberFormat('en', {
														currency: 'AED',
														style: 'currency',
													}).format(12)}
												</HeadingSmall>
											</div>
										</div>
									</CardContent>
								</DetailViewerCard>

								<div className={css({ marginBottom: '24px' })} />

								<DetailViewerCard title="Last order placed">
									<CardContent>
										<TaskTable>
											<>
												<TaskTableData
													colSpan={2}
													$style={{ display: 'flex', alignItems: 'center' }}
												>
													<StyledLink $as={Link} to="/">
														#123
													</StyledLink>

													<span
														className={css({ width: '6px', display: 'block' })}
													/>

													<Badge color={COLOR.positive} content="New" />

													<span
														className={css({ width: '6px', display: 'block' })}
													/>

													<Badge color={COLOR.warning} content="Unfulfilled" />
												</TaskTableData>
												<TaskTableData align="right">
													{Intl.NumberFormat('en', {
														style: 'currency',
														currency: 'AED',
													}).format(299.0)}
												</TaskTableData>
											</>
											<>
												<TaskTableData colSpan={3}>
													<LabelXSmall>
														24 December 2022 at 3:49 pm from Draft Orders
													</LabelXSmall>
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
								</Grid>
							</Cell>
						</Grid>
					</div>
				</ContentWrapper>
			</DefaultLayout>
		</DataSourceProvider>
	);
};

export const Primary = Template.bind({});
