import DefaultLayout from '../Layouts/Default';
import { Meta, StoryFn } from '@storybook/react';
import { defaultLayoutItems } from './data';
import { DataSourceProvider, DataSources } from '../Features/Datasource';
import { Cell, Grid } from 'baseui/layout-grid';
import DetailViewerCard, {
	CardAction,
	CardContent,
	CardDivider,
	CardTitle,
} from '../Features/DetailViewer';
import ContentWrapper from '../Features/Layout/ContentWrapper';
import React from 'react';
import { useStyletron } from 'baseui';
import { FormControl } from 'baseui/form-control';
import { Input } from 'baseui/input';
import { Select } from 'baseui/select';
import PictureUpload from '../Features/PictureUpload';
import { Checkbox } from 'baseui/checkbox';
import FormBuilder from '../Features/FormBuilder';
import { FormSchema } from '../Features/FormBuilder/types';
import { TaskMetaData, TaskMetaDataItem } from '../Features/TaskMetaData';

const formSchema: FormSchema = {
	properties: {
		productCategory: {
			name: 'productCategory',
			type: 'string',
			enum: ['Fruits'],
			title: 'Product category',
		},
		productType: {
			name: 'productType',
			type: 'string',
			title: 'Product type',
			enum: ['simple', 'simple,virtual'],
		},
		vendor: {
			name: 'vendor',
			type: 'string',
			title: 'Vendor',
		},
		collection: {
			type: 'string',
			title: 'Collection',
			enum: ['Fruits'],
			name: 'collection',
		},
		tags: {
			name: 'tags',
			type: 'array',
			title: 'Tags',
			format: 'select',
			dataSource: 'static',
			enum: [],
			creatable: true,
			valueKey: 'id',
			labelKey: 'label',
			isMulti: true,
		},
	},
};

const dataMemo: FormSchema = {
	properties: {
		title: {
			name: 'title',
			type: 'string',
			title: 'Product name',
		},
		description: {
			name: 'description',
			type: 'string',
			format: 'markdown',
			title: 'Description',
		},
	},
};

export default {
	title: 'Anthaathi/Admin/Examples/ProductDetailsPage',
	component: DefaultLayout,
	// More on argTypes: https://storybook.js.org/docs/react/api/argtypes
	argTypes: {},
} as Meta<typeof DefaultLayout>;

const datasource: DataSources = {};

const Template: StoryFn<typeof DefaultLayout> = (args) => {
	const [css] = useStyletron();

	return (
		<DataSourceProvider dataSources={datasource}>
			<DefaultLayout items={[]} {...args}>
				<ContentWrapper
					breadcrumb={[
						{
							title: 'Dashboard',
							to: '/',
						},
						{
							title: 'Product',
						},
					]}
					toolbarTab={[
						{
							title: 'Dashboard',
							isActive: true,
						},
						{
							title: 'Reports',
						},
					]}
					title="Mango"
					fullWidth={false}
				>
					<div
						className={css({
							width: 'calc(100% - 12px)',
							maxWidth: '1300px',
						})}
					>
						<Grid gridMaxWidth={0} gridMargins={0}>
							<Cell span={8}>
								<DetailViewerCard>
									<CardContent>
										<FormBuilder schema={dataMemo} onSubmit={() => {}} />
									</CardContent>
								</DetailViewerCard>

								<br />

								<DetailViewerCard title="Media">
									<CardContent>
										<PictureUpload
											onItemRemove={() => {}}
											items={[
												{
													pictureUrl: 'https://picsum.photos/1200/1200',
													isLoading: false,
													key: 1,
												},
												{
													pictureUrl: 'https://picsum.photos/300/300',
													isLoading: true,
													key: 2,
												},
												{
													pictureUrl: 'https://picsum.photos/300/300',
													isLoading: true,
													key: 3,
												},
												{
													pictureUrl: 'https://picsum.photos/300/300',
													isLoading: true,
													key: 4,
												},
												{
													pictureUrl: 'https://picsum.photos/300/300',
													isLoading: true,
													key: 5,
												},
												{
													pictureUrl: 'https://picsum.photos/300/300',
													isLoading: true,
													key: 6,
												},
											]}
											onFileChange={console.log}
										/>
									</CardContent>
								</DetailViewerCard>

								<br />

								<DetailViewerCard title="Pricing">
									<CardContent>
										<form>
											<FormControl label="Price">
												<Input placeholder="Price" startEnhancer="AED" />
											</FormControl>
											<FormControl label="Compare at price">
												<Input
													placeholder="Compare at price"
													startEnhancer="AED"
												/>
											</FormControl>
										</form>
									</CardContent>

									<CardDivider />
									<CardContent>
										<FormControl
											caption="Customers won’t see this"
											label="Cost per item"
										>
											<Input
												type="number"
												placeholder="Cost per item"
												startEnhancer="AED"
											/>
										</FormControl>
									</CardContent>
								</DetailViewerCard>

								<br />

								<DetailViewerCard title="Inventory">
									<CardContent>
										<Grid gridMaxWidth={0} gridMargins={0}>
											<Cell span={6}>
												<FormControl label="SKU (Stock Keeping Unit)">
													<Input placeholder="SKU (Stock Keeping Unit)" />
												</FormControl>
											</Cell>
											<Cell span={6}>
												<FormControl label="Barcode (ISBN, UPC, GTIN, etc.)">
													<Input placeholder="Barcode (ISBN, UPC, GTIN, etc.)" />
												</FormControl>
											</Cell>
										</Grid>

										<Checkbox>Track quantity</Checkbox>
									</CardContent>
									<CardDivider />
									<CardTitle>Quantity</CardTitle>
									<CardContent>
										<TaskMetaData span={12} gaps={24}>
											<TaskMetaDataItem title="Kolhapur">
												<Input placeholder="Available quantity" type="number" />
											</TaskMetaDataItem>
											<CardDivider />
										</TaskMetaData>
									</CardContent>
								</DetailViewerCard>
							</Cell>
							<Cell span={4}>
								<DetailViewerCard title="Product status">
									<CardContent>
										<Select options={[{ label: 'Active', id: 'active' }]} />
									</CardContent>

									<CardAction />
								</DetailViewerCard>

								<br />

								<DetailViewerCard title="Product organization">
									<CardContent>
										<FormBuilder onSubmit={() => {}} schema={formSchema} />
									</CardContent>
								</DetailViewerCard>
							</Cell>
						</Grid>
					</div>
				</ContentWrapper>
			</DefaultLayout>
		</DataSourceProvider>
	);
};

export const Primary = Template.bind({});

Primary.args = {
	items: defaultLayoutItems,
};
