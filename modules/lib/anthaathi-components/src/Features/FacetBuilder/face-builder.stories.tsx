/*
 * Copyright (c) Anthaathi Private Limited 2022.
 *
 * This code is the exclusive property of Anthaathi Private Limited and is protected by copyright and intellectual property laws.
 * Any unauthorized use, reproduction, distribution, or modification of this code is strictly prohibited.
 *
 * Anthaathi Private Limited reserves all rights in and to this code and will vigorously defend its intellectual property rights.
 */

import { Meta, StoryFn } from '@storybook/react';
import {
	RenderFacetBuilder,
	RenderFacetBuilderProps,
} from './Components/RenderFacetBuilder';
import { DefaultLayout } from '../../Layouts/public';
import ContentWrapper from '../Layout/ContentWrapper';
import { DataSourceProvider } from '../Datasource';
import { Block } from 'baseui/block';
import { FlexFill } from '../Header';
import { Card } from '../DetailViewer';

export default {
	title: 'Anthaathi/FacetBuilder',
	component: RenderFacetBuilder,
	argTypes: {},
} as Meta<typeof RenderFacetBuilder>;

const Template: StoryFn<RenderFacetBuilderProps> = (args) => (
	<DataSourceProvider dataSources={{}}>
		<DefaultLayout items={[]}>
			<ContentWrapper
				breadcrumb={[]}
				toolbarTab={[]}
				title="Toolbar"
				fullWidth={false}
			>
				<Block
					width="100%"
					maxWidth="1600px"
					marginLeft="auto"
					marginRight="auto"
					display="flex"
				>
					<FlexFill />
					<Block width="420px">
						<Card
							$style={{
								boxShadow: 'none',
								border: '1px solid #EEE',
								paddingLeft: '12px',
								paddingRight: '12px',
								paddingTop: '12px',
								paddingBottom: '12px',
							}}
						>
							<RenderFacetBuilder {...args} />
						</Card>
					</Block>
				</Block>
			</ContentWrapper>
		</DefaultLayout>
	</DataSourceProvider>
);

export const Primary = Template.bind({});

Primary.args = {
	data: {},
	schema: {
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
		},
	},
};
