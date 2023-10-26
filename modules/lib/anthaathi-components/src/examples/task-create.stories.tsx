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
import { useState } from 'react';
import { Block } from 'baseui/block';
import { ProgressSteps, Step } from 'baseui/progress-steps';
import { BadgeList, BadgeListItem, BadgeSize } from '../Features/BadgesList';
import { Checkbox } from 'baseui/checkbox';
import { FormSchema } from '../Features/FormBuilder/types';
import FormBuilder from '../Features/FormBuilder';
import { HeadingSmall } from 'baseui/typography';

export default {
	title: 'Anthaathi/Admin/Examples/TaskCreate',
} as ComponentMeta<typeof DefaultLayout>;

const Template: ComponentStory<typeof DefaultLayout> = (args) => {
	const [activeTab, setActiveTab] = useState<'all' | 'table'>('all');
	const [formSchema, setFormSchema] = useState<any>(null);

	return (
		<DataSourceProvider dataSources={{}}>
			<DefaultLayout {...args}>
				<ContentWrapper
					breadcrumb={[
						{
							title: 'Home',
						},
					]}
					title="Task create"
					fullWidth={true}
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
					maxWidth="1000px"
					center={true}
				>
					<Block
						maxWidth="1000px"
						marginLeft="auto"
						marginRight="auto"
						width="100%"
					>
						<Block display={['none', 'none', 'block']}>
							<ProgressSteps
								current={formSchema === null ? 0 : 1}
								overrides={{
									Root: {
										style: {
											width: 'calc(100% - 78px)',
										},
									},
								}}
							>
								<Step
									title="Status"
									overrides={{
										Content: { style: { width: '100%' } },
										Root: { style: { width: '100%' } },
									}}
								>
									<Block width="100%">
										<BadgeList $size={BadgeSize.SMALL}>
											{Object.entries(template).map(([name, schema]) => {
												return (
													<BadgeListItem
														title={name}
														onClick={() => setFormSchema(schema)}
													>
														<Checkbox />
													</BadgeListItem>
												);
											})}
										</BadgeList>
									</Block>
								</Step>
								<Step title="Information">
									<FormBuilder schema={formSchema} onSubmit={() => {}} />
								</Step>
							</ProgressSteps>
						</Block>

						<Block display={['block', 'block', 'none']} padding="scale800">
							<HeadingSmall marginBottom="scale800" marginTop="0">
								{formSchema === null ? 'Select template' : 'Information'}
							</HeadingSmall>

							{formSchema === null ? (
								<BadgeList $size={BadgeSize.DEFAULT}>
									{Object.entries(template).map(([name, schema]) => {
										return (
											<BadgeListItem
												title={name}
												onClick={() => setFormSchema(schema)}
											>
												<Checkbox />
											</BadgeListItem>
										);
									})}
								</BadgeList>
							) : (
								<FormBuilder schema={formSchema} onSubmit={() => {}} />
							)}
						</Block>
					</Block>
				</ContentWrapper>
			</DefaultLayout>
		</DataSourceProvider>
	);
};

export const primary = Template.bind({});

const template: Record<string, FormSchema> = {
	Hospital: {
		properties: {
			patientName: {
				name: 'patientName',
				type: 'array',
				dataSource: 'dynamic',
				dataSourceKey: 'source',
				format: 'select',
				title: 'Patient name',
				creatable: true,
			},
			address: {
				name: 'address',
				type: 'string',
				format: 'markdown',
				title: 'Address',
			},
			phone: {
				name: 'phone',
				type: 'string',
				title: 'Phone',
			},
			hospital: {
				name: 'hospital',
				type: 'string',
				title: 'Hospital',
				colSpan: [12, 6, 6],
			},
			department: {
				name: 'department',
				type: 'string',
				title: 'Department',
				colSpan: [12, 6, 6],
			},
			referredBy: {
				name: 'referredBy',
				type: 'array',
				dataSource: 'static',
				title: 'Referred by',
				format: 'select',
				creatable: true,
			},
			illness: {
				name: 'illness',
				type: 'string',
				format: 'markdown',
				title: 'Illness',
			},
			estimateDays: {
				name: 'Estimate days',
				type: 'number',
				title: 'Estimate days',
				inputProps: {
					endEnhancer: 'Days',
				},
			},
			submit: {
				name: 'submit',
				type: 'submit',
				title: 'Submit',
				colSpan: [12, 12, 3],
			},
		},
	},
	Police: {
		properties: {
			suspectName: {
				name: 'suspectName',
				type: 'array',
				dataSource: 'dynamic',
				dataSourceKey: 'users',
				format: 'select',
				title: 'Suspect name',
				creatable: true,
			},
			address: {
				name: 'address',
				type: 'string',
				format: 'markdown',
				title: 'Address',
			},
			phone: {
				name: 'phone',
				type: 'string',
				title: 'Phone',
			},
			policeStation: {
				name: 'policeStation',
				type: 'string',
				title: 'Police station',
				colSpan: [12, 6, 6],
			},
			department: {
				name: 'department',
				type: 'string',
				title: 'Department',
				colSpan: [12, 6, 6],
			},
			referredBy: {
				name: 'referredBy',
				type: 'array',
				dataSource: 'static',
				title: 'Referred by',
				format: 'select',
				creatable: true,
			},
			crime: {
				name: 'crime',
				type: 'string',
				format: 'markdown',
				title: 'Illness',
			},
			estimateDays: {
				name: 'Estimate days',
				type: 'number',
				title: 'Estimate days',
				inputProps: {
					endEnhancer: 'Days',
				},
			},
			submit: {
				name: 'submit',
				type: 'submit',
				title: 'Submit',
				colSpan: [12, 12, 3],
			},
		},
	},
	RTO: {
		properties: {
			personName: {
				name: 'personName',
				type: 'array',
				dataSource: 'dynamic',
				dataSourceKey: 'users',
				format: 'select',
				title: 'Person name',
				creatable: true,
			},
			address: {
				name: 'address',
				type: 'string',
				format: 'markdown',
				title: 'Address',
			},
			phone: {
				name: 'phone',
				type: 'string',
				title: 'Phone',
			},
			department: {
				name: 'department',
				type: 'string',
				title: 'Department',
				colSpan: [12, 6, 6],
			},
			referredBy: {
				name: 'referredBy',
				type: 'array',
				dataSource: 'static',
				title: 'Referred by',
				format: 'select',
				creatable: true,
			},
			typeOfWork: {
				name: 'typeOfWork',
				type: 'string',
				format: 'markdown',
				title: 'Type of work',
			},
			estimateDays: {
				name: 'Estimate days',
				type: 'number',
				title: 'Estimate days',
				inputProps: {
					endEnhancer: 'Days',
				},
			},
			submit: {
				name: 'submit',
				type: 'submit',
				title: 'Submit',
				colSpan: [12, 12, 3],
			},
		},
	},
	'Admission to own': {
		properties: {
			personName: {
				name: 'personName',
				type: 'array',
				dataSource: 'dynamic',
				dataSourceKey: 'users',
				format: 'select',
				title: 'Person name',
				creatable: true,
			},
			address: {
				name: 'address',
				type: 'string',
				format: 'markdown',
				title: 'Address',
			},
			phone: {
				name: 'phone',
				type: 'string',
				title: 'Phone',
			},
			collegeName: {
				name: 'collegeName',
				type: 'string',
				title: 'College name',
				colSpan: [12, 6, 6],
			},
			department: {
				name: 'department',
				type: 'string',
				title: 'Department',
				colSpan: [12, 6, 6],
			},
			referredBy: {
				name: 'referredBy',
				type: 'array',
				dataSource: 'static',
				title: 'Referred by',
				format: 'select',
				creatable: true,
			},
			typeOfWork: {
				name: 'typeOfWork',
				type: 'string',
				format: 'markdown',
				title: 'Type of work',
			},
			estimateDays: {
				name: 'Estimate days',
				type: 'number',
				title: 'Estimate days',
				inputProps: {
					endEnhancer: 'Days',
				},
			},
			submit: {
				name: 'submit',
				type: 'submit',
				title: 'Submit',
				colSpan: [12, 12, 3],
			},
		},
	},
	'Admission to other': {
		properties: {
			personName: {
				name: 'personName',
				type: 'array',
				dataSource: 'dynamic',
				dataSourceKey: 'users',
				format: 'select',
				title: 'Person name',
				creatable: true,
			},
			address: {
				name: 'address',
				type: 'string',
				format: 'markdown',
				title: 'Address',
			},
			phone: {
				name: 'phone',
				type: 'string',
				title: 'Phone',
			},
			collegeName: {
				name: 'collegeName',
				type: 'string',
				title: 'College name',
				colSpan: [12, 6, 6],
			},
			department: {
				name: 'department',
				type: 'string',
				title: 'Department',
				colSpan: [12, 6, 6],
			},
			referredBy: {
				name: 'referredBy',
				type: 'array',
				dataSource: 'static',
				title: 'Referred by',
				format: 'select',
				creatable: true,
			},
			typeOfWork: {
				name: 'typeOfWork',
				type: 'string',
				format: 'markdown',
				title: 'Type of work',
			},
			estimateDays: {
				name: 'Estimate days',
				type: 'number',
				title: 'Estimate days',
				inputProps: {
					endEnhancer: 'Days',
				},
			},
			submit: {
				name: 'submit',
				type: 'submit',
				title: 'Submit',
				colSpan: [12, 12, 3],
			},
		},
	},
};
