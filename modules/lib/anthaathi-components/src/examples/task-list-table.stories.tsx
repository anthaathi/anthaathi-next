/*
 * Copyright (c) Anthaathi Private Limited 2023.
 *
 * This code is the exclusive property of Anthaathi Private Limited and is protected by copyright and intellectual property laws.
 * Any unauthorized use, reproduction, distribution, or modification of this code is strictly prohibited.
 *
 * Anthaathi Private Limited reserves all rights in and to this code and will vigorously defend its intellectual property rights.
 */

import { ComponentMeta, ComponentStory } from '@storybook/react';
import DefaultLayout from '../Layouts/Default';
import { DataSourceProvider } from '../Features/Datasource';
import ContentWrapper from '../Features/Layout/ContentWrapper';
import { Block } from 'baseui/block';
import DataTable from '../Features/Datatables';
import { ConfigProvider } from '../Features/Datatables/public';
import { HeadingSmall, ParagraphSmall } from 'baseui/typography';
import { Cell, Grid } from 'baseui/layout-grid';
import {
	Card,
	CardAction,
	CardContent,
	CardTitle,
} from '../Features/DetailViewer';
import { useState } from 'react';

export default {
	title: 'Anthaathi/Admin/Examples/TaskListTable',
	args: {
		items: [],
	},
} as ComponentMeta<typeof DefaultLayout>;

const Template: ComponentStory<typeof DefaultLayout> = (args) => {
	const [activeTab, setActiveTab] = useState<'all' | 'table'>('all');

	return (
		<DataSourceProvider dataSources={{}}>
			<DefaultLayout {...args}>
				<ContentWrapper
					breadcrumb={[
						{
							title: 'Home',
						},
					]}
					title="Some"
					fullWidth={false}
					toolbarTab={[
						{
							title: 'All',
							isActive: activeTab === 'all',
							onClick: () => {
								setActiveTab('all');
							},
						},
						{
							title: 'Table',
							isActive: activeTab === 'table',
							onClick: () => {
								setActiveTab('table');
							},
						},
					]}
					maxWidth="1600px"
					center={true}
				>
					{activeTab === 'all' && (
						<Block maxWidth="1600px" margin="0 auto">
							<HeadingSmall marginTop={0} marginBottom="scale600">
								Pending
							</HeadingSmall>

							<Grid
								gridMaxWidth={0}
								gridMargins={0}
								gridGaps={12}
								gridGutters={12}
							>
								<Cell span={[12, 12, 3, 3]}>
									<Card $style={{ cursor: 'pointer' }}>
										<CardTitle>Hello world</CardTitle>
										<CardContent>
											<ParagraphSmall marginTop={0} marginBottom={0}>
												Lorem ipsum dolor sit amet, consectetur adipisicing
												elit. Aspernatur aut, autem cumque dolore dolorem id
												ipsum obcaecati quo. Dolorum eligendi eos excepturi,
												iure modi necessitatibus obcaecati quidem recusandae rem
												vitae.
											</ParagraphSmall>
										</CardContent>
										<CardAction></CardAction>
									</Card>
								</Cell>
								<Cell span={[12, 12, 3, 3]}>
									<Card $style={{ cursor: 'pointer' }}>
										<CardTitle>Hello world</CardTitle>
										<CardContent>
											<ParagraphSmall marginTop={0} marginBottom={0}>
												Lorem ipsum dolor sit amet, consectetur adipisicing
												elit. Aspernatur aut, autem cumque dolore dolorem id
												ipsum obcaecati quo. Dolorum eligendi eos excepturi,
												iure modi necessitatibus obcaecati quidem recusandae rem
												vitae.
											</ParagraphSmall>
										</CardContent>
										<CardAction></CardAction>
									</Card>
								</Cell>
								<Cell span={[12, 12, 3, 3]}>
									<Card $style={{ cursor: 'pointer' }}>
										<CardTitle>Hello world</CardTitle>
										<CardContent>
											<ParagraphSmall marginTop={0} marginBottom={0}>
												Lorem ipsum dolor sit amet, consectetur adipisicing
												elit. Aspernatur aut, autem cumque dolore dolorem id
												ipsum obcaecati quo. Dolorum eligendi eos excepturi,
												iure modi necessitatibus obcaecati quidem recusandae rem
												vitae.
											</ParagraphSmall>
										</CardContent>
										<CardAction></CardAction>
									</Card>
								</Cell>
								<Cell span={[12, 12, 3, 3]}>
									<Card $style={{ cursor: 'pointer' }}>
										<CardTitle>Hello world</CardTitle>
										<CardContent>
											<ParagraphSmall marginTop={0} marginBottom={0}>
												Lorem ipsum dolor sit amet, consectetur adipisicing
												elit. Aspernatur aut, autem cumque dolore dolorem id
												ipsum obcaecati quo. Dolorum eligendi eos excepturi,
												iure modi necessitatibus obcaecati quidem recusandae rem
												vitae.
											</ParagraphSmall>
										</CardContent>
										<CardAction></CardAction>
									</Card>
								</Cell>
								<Cell span={[12, 12, 3, 3]}>
									<Card $style={{ cursor: 'pointer' }}>
										<CardTitle>Hello world</CardTitle>
										<CardContent>
											<ParagraphSmall marginTop={0} marginBottom={0}>
												Lorem ipsum dolor sit amet, consectetur adipisicing
												elit. Aspernatur aut, autem cumque dolore dolorem id
												ipsum obcaecati quo. Dolorum eligendi eos excepturi,
												iure modi necessitatibus obcaecati quidem recusandae rem
												vitae.
											</ParagraphSmall>
										</CardContent>
										<CardAction></CardAction>
									</Card>
								</Cell>
								<Cell span={[12, 12, 3, 3]}>
									<Card $style={{ cursor: 'pointer' }}>
										<CardTitle>Hello world</CardTitle>
										<CardContent>
											<ParagraphSmall marginTop={0} marginBottom={0}>
												Lorem ipsum dolor sit amet, consectetur adipisicing
												elit. Aspernatur aut, autem cumque dolore dolorem id
												ipsum obcaecati quo. Dolorum eligendi eos excepturi,
												iure modi necessitatibus obcaecati quidem recusandae rem
												vitae.
											</ParagraphSmall>
										</CardContent>
										<CardAction></CardAction>
									</Card>
								</Cell>
								<Cell span={[12, 12, 3, 3]}>
									<Card $style={{ cursor: 'pointer' }}>
										<CardTitle>Hello world</CardTitle>
										<CardContent>
											<ParagraphSmall marginTop={0} marginBottom={0}>
												Lorem ipsum dolor sit amet, consectetur adipisicing
												elit. Aspernatur aut, autem cumque dolore dolorem id
												ipsum obcaecati quo. Dolorum eligendi eos excepturi,
												iure modi necessitatibus obcaecati quidem recusandae rem
												vitae.
											</ParagraphSmall>
										</CardContent>
										<CardAction></CardAction>
									</Card>
								</Cell>
								<Cell span={[12, 12, 3, 3]}>
									<Card $style={{ cursor: 'pointer' }}>
										<CardTitle>Hello world</CardTitle>
										<CardContent>
											<ParagraphSmall marginTop={0} marginBottom={0}>
												Lorem ipsum dolor sit amet, consectetur adipisicing
												elit. Aspernatur aut, autem cumque dolore dolorem id
												ipsum obcaecati quo. Dolorum eligendi eos excepturi,
												iure modi necessitatibus obcaecati quidem recusandae rem
												vitae.
											</ParagraphSmall>
										</CardContent>
										<CardAction></CardAction>
									</Card>
								</Cell>
								<Cell span={[12, 12, 3, 3]}>
									<Card $style={{ cursor: 'pointer' }}>
										<CardTitle>Hello world</CardTitle>
										<CardContent>
											<ParagraphSmall marginTop={0} marginBottom={0}>
												Lorem ipsum dolor sit amet, consectetur adipisicing
												elit. Aspernatur aut, autem cumque dolore dolorem id
												ipsum obcaecati quo. Dolorum eligendi eos excepturi,
												iure modi necessitatibus obcaecati quidem recusandae rem
												vitae.
											</ParagraphSmall>
										</CardContent>
										<CardAction></CardAction>
									</Card>
								</Cell>
								<Cell span={[12, 12, 3, 3]}>
									<Card $style={{ cursor: 'pointer' }}>
										<CardTitle>Hello world</CardTitle>
										<CardContent>
											<ParagraphSmall marginTop={0} marginBottom={0}>
												Lorem ipsum dolor sit amet, consectetur adipisicing
												elit. Aspernatur aut, autem cumque dolore dolorem id
												ipsum obcaecati quo. Dolorum eligendi eos excepturi,
												iure modi necessitatibus obcaecati quidem recusandae rem
												vitae.
											</ParagraphSmall>
										</CardContent>
										<CardAction></CardAction>
									</Card>
								</Cell>
								<Cell span={[12, 12, 3, 3]}>
									<Card $style={{ cursor: 'pointer' }}>
										<CardTitle>Hello world</CardTitle>
										<CardContent>
											<ParagraphSmall marginTop={0} marginBottom={0}>
												Lorem ipsum dolor sit amet, consectetur adipisicing
												elit. Aspernatur aut, autem cumque dolore dolorem id
												ipsum obcaecati quo. Dolorum eligendi eos excepturi,
												iure modi necessitatibus obcaecati quidem recusandae rem
												vitae.
											</ParagraphSmall>
										</CardContent>
										<CardAction></CardAction>
									</Card>
								</Cell>
								<Cell span={[12, 12, 3, 3]}>
									<Card $style={{ cursor: 'pointer' }}>
										<CardTitle>Hello world</CardTitle>
										<CardContent>
											<ParagraphSmall marginTop={0} marginBottom={0}>
												Lorem ipsum dolor sit amet, consectetur adipisicing
												elit. Aspernatur aut, autem cumque dolore dolorem id
												ipsum obcaecati quo. Dolorum eligendi eos excepturi,
												iure modi necessitatibus obcaecati quidem recusandae rem
												vitae.
											</ParagraphSmall>
										</CardContent>
										<CardAction></CardAction>
									</Card>
								</Cell>
							</Grid>
						</Block>
					)}
					{activeTab === 'table' && (
						<Block maxWidth="1600px" margin="0 auto">
							<ConfigProvider>
								<DataTable
									data={[
										{
											id: '123',
											title:
												'Lorem ipsum dolor sit amet, consectetur adipisicing elit. At est fugiat impedit in ipsum itaque laboriosam magnam natus nostrum, obcaecati praesentium provident quae rerum unde voluptate? Magni optio recusandae sed?',
											assignedPerson: 'Omkar Yadav',
										},
										{
											id: '12',
											title:
												'Lorem ipsum dolor sit amet, consectetur adipisicing elit. At est fugiat impedit in ipsum itaque laboriosam magnam natus nostrum, obcaecati praesentium provident quae rerum unde voluptate? Magni optio recusandae sed? Lorem ipsum dolor sit amet, consectetur adipisicing elit. At est fugiat impedit in ipsum itaque laboriosam magnam natus nostrum, obcaecati praesentium provident quae rerum unde voluptate? Magni optio recusandae sed?',
											assignedPerson: 'Omkar Yadav',
										},
									]}
									schema={{
										properties: {
											id: {
												title: 'ID',
												name: 'id',
												type: 'string',
											},
											title: {
												title: 'Title',
												type: 'string',
												name: 'title',
											},
											progress: {
												name: 'progress',
												type: 'number',
												title: 'Progress',
											},
											assignedPerson: {
												name: 'assignedPerson',
												type: 'string',
												title: 'Assigned person',
											},
										},
									}}
								/>
							</ConfigProvider>
						</Block>
					)}
				</ContentWrapper>
			</DefaultLayout>
		</DataSourceProvider>
	);
};

export const Primary = Template.bind({});
