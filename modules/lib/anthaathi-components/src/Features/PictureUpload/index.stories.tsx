import { Meta, StoryFn } from '@storybook/react';
import PictureUpload from './index';

export default {
	title: 'Anthaathi/Admin/PictureUpload',
	component: PictureUpload,
	// More on argTypes: https://storybook.js.org/docs/react/api/argtypes
	argTypes: {},
} as Meta<typeof PictureUpload>;

const Template: StoryFn<typeof PictureUpload> = (args) => {
	return <PictureUpload items={[]} {...args} />;
};

export const Primary = Template.bind({});

Primary.args = {
	onFileChange: (e) => {
		console.log(e.target.files);
	},
	items: [
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
	],
};
