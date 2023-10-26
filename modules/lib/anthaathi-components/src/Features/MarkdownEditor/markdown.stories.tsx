/*
 * Copyright (c) Anthaathi Private Limited 2023.
 *
 * This code is the exclusive property of Anthaathi Private Limited and is protected by copyright and intellectual property laws.
 * Any unauthorized use, reproduction, distribution, or modification of this code is strictly prohibited.
 *
 * Anthaathi Private Limited reserves all rights in and to this code and will vigorously defend its intellectual property rights.
 */

import { Meta, StoryFn } from '@storybook/react';
import { MarkdownEditor } from './Components/MarkdownEditor';
import DefaultLayout from '../../Layouts/Default';
import ContentWrapper from '../Layout/ContentWrapper';
import { DataSourceProvider } from '../Datasource';
import { useState } from 'react';

export default {
	title: 'Anthaathi/Admin/MarkdownEditor',
	component: MarkdownEditor,
	argTypes: {},
} as Meta<typeof MarkdownEditor>;

const Template: StoryFn<typeof MarkdownEditor> = (args) => {
	const [value, setValue] = useState('');

	return (
		<DataSourceProvider dataSources={{}}>
			<DefaultLayout items={[]}>
				<ContentWrapper
					breadcrumb={[]}
					toolbarTab={[]}
					title="Template"
					fullWidth={false}
				>
					<MarkdownEditor
						value={value}
						onChange={(_value) => {
							setValue(_value);
						}}
						onFileUpload={() => {
							return new Promise((resolve) => {
								setTimeout(() => {
									resolve(
										'https://picsum.photos/200/300?cache=' +
											Math.floor(Math.random() * 1000)
									);
								}, 1000);
							});
						}}
						{...args}
					/>
				</ContentWrapper>
			</DefaultLayout>
		</DataSourceProvider>
	);
};

export const Primary = Template.bind({});

Primary.args = {};
