import { ArrayDynamicField, ArrayFieldDefault, FormSchema } from './types';

export const defaultSchema: FormSchema = {
	properties: {
		location: {
			name: 'location',
			type: 'string',
			title: 'Location',
			enum: ['New York', 'London', 'San Francisco', 'Tokyo'],
			colSpan: 12,
		},
		firstName: {
			name: 'firstName',
			type: 'string',
			title: 'First name',
			description: 'First name of the user',
			colSpan: 6,
			defaultValue: 'John',
		},
		lastName: {
			name: 'lastName',
			type: 'string',
			title: 'Last name',
			colSpan: 6,
		},
		email: {
			name: 'email',
			type: 'string',
			format: 'email',
			title: 'Email',
		},
		password: {
			name: 'password',
			type: 'string',
			format: 'password',
			title: 'Password',
		},
		age: {
			name: 'age',
			type: 'number',
			title: 'Age',
		},
		date: {
			name: 'date',
			type: 'string',
			format: 'date-time',
			title: 'Date',
		},
		time: {
			name: 'time',
			type: 'string',
			format: 'time',
			title: 'Time',
		},
		checkbox: {
			name: 'checkbox',
			type: 'boolean',
			format: 'checkbox',
			title: 'Checkbox',
		},
		select: {
			name: 'select',
			type: 'string',
			title: 'Select',
			enum: ['Option 1', 'Option 2', 'Option 3'],
		},
		radio: {
			name: 'radio',
			type: 'string',
			format: 'radio',
			title: 'Select',
			enum: ['Option 1', 'Option 2', 'Option 3'],
		},
		fromServer: {
			name: 'fromServer',
			type: 'array',
			title: 'From Server',
			format: 'select',
			dataSource: 'dynamic',
			dataSourceKey: 'test',
			valueKey: 'id',
			labelKey: 'label',
		} as ArrayDynamicField & ArrayFieldDefault,
		submit: {
			name: 'submit',
			type: 'submit',
			title: 'Submit',
			colSpan: 2,
			condition: {
				'==': [
					{
						var: 'firstName',
					},
					'John',
				],
			},
		},
		cancel: {
			name: 'cancel',
			type: 'submit',
			title: 'Cancel',
			colSpan: 2,
			condition: {
				'==': [
					{
						var: 'firstName',
					},
					'John',
				],
			},
		},
		section: {
			name: 'section',
			type: 'section',
			title: 'Section',
			colSpan: 12,
		},
		link: {
			name: 'link',
			type: 'link',
			title: 'Link',
		},
	},
	required: [
		'name',
		'email',
		'password',
		'age',
		'date',
		'time',
		'checkbox',
		'select',
		'radio',
		'fromServer',
		'location',
	],
};

export const layout: FormSchema = {
	properties: {
		orderId: {
			name: 'orderId',
			type: 'link',
			title: 'Order ID',
		},
		pickerStatus: {
			name: 'pickerStatus',
			type: 'string',
			title: 'Picker Status',
			format: 'tag',
			enum: ['Picked', 'Picking', 'Not Picked'],
		},
		assignedStatus: {
			name: 'assignedStatus',
			type: 'string',
			format: 'tag',
			title: 'Assigned Status',
		},
		assignedDriverStatus: {
			name: 'assignedDriverStatus',
			type: 'string',
			format: 'tag',
			title: 'Assigned Driver Status',
		},
		emirate: {
			name: 'emirate',
			type: 'string',
			title: 'Emirate',
			enum: [
				'Dubai',
				'Abu Dhabi',
				'Sharjah',
				'Ajman',
				'Fujairah',
				'Ras Al Khaimah',
				'Umm Al Quwain',
			],
		},
		zone: {
			name: 'zone',
			type: 'string',
			title: 'Zone',
			enum: ['Zone 1', 'Zone 2', 'Zone 3', 'Zone 4', 'Zone 5'],
		},
		deliveryDate: {
			name: 'deliveryDate',
			type: 'string',
			format: 'date-time',
			title: 'Delivery Date',
			dateFormat: {
				year: 'numeric',
				month: 'long',
				day: '2-digit',
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit',
			},
		},
		customerDetails: {
			name: 'customerDetails',
			type: 'string',
			title: 'Customer Details',
		},
		addressDetails: {
			name: 'addressDetails',
			type: 'string',
			title: 'Address Details',
		},
		numberOfItems: {
			name: 'numberOfItems',
			type: 'number',
			title: 'Number of Items',
		},
		discountCode: {
			name: 'discountCode',
			type: 'string',
			title: 'Discount Code',
		},
		grandTotal: {
			name: 'grandTotal',
			type: 'number',
			format: 'currency',
			title: 'Grand Total',
			currencyField: 'currency',
		},
		currency: {
			name: 'currency',
			type: 'hidden',
			title: 'Currency',
		},
		paymentMethod: {
			name: 'paymentMethod',
			type: 'string',
			title: 'Payment Method',
			enum: ['Cash', 'Card', 'Wallet'],
		},
		orderDate: {
			name: 'orderDate',
			type: 'string',
			format: 'date-time',
			title: 'Order Date',
			dateFormat: {
				year: 'numeric',
				month: 'long',
				day: '2-digit',
				hour: '2-digit',
				minute: '2-digit',
			},
		},
		orderStatus: {
			name: 'orderStatus',
			type: 'string',
			title: 'Order Status',
			enum: ['Pending', 'Confirmed', 'Cancelled'],
		},
		warehouseStatus: {
			name: 'warehouseStatus',
			type: 'string',
			title: 'Warehouse Status',
			enum: ['Pending', 'Confirmed', 'Cancelled'],
		},
		pickedStatus: {
			name: 'pickedStatus',
			type: 'string',
			title: 'Picker Status',
			enum: ['Pending', 'Confirmed', 'Cancelled'],
		},
		deliveryStatus: {
			name: 'deliveryStatus',
			type: 'string',
			title: 'Delivery Status',
			enum: ['Pending', 'Confirmed', 'Cancelled'],
		},
		assignedPickerStatus: {
			name: 'assignedPickerStatus',
			type: 'string',
			title: 'Assigned Status',
			enum: ['Pending', 'Confirmed', 'Cancelled'],
		},
		assignedDriver: {
			name: 'assignedDriver',
			type: 'string',
			title: 'Assigned Driver',
			enum: ['Driver 1', 'Driver 2', 'Driver 3'],
		},
		specialInstructions: {
			name: 'specialInstructions',
			type: 'string',
			title: 'Special Instructions',
		},
		area: {
			name: 'area',
			type: 'string',
			title: 'Area',
		},
		customerName: {
			name: 'customerName',
			type: 'string',
			title: 'Customer Name',
		},
		customerEmail: {
			name: 'customerEmail',
			type: 'string',
			title: 'Customer Email',
			format: 'email',
		},
		divider: {
			type: 'divider',
			name: 'divider',
			title: '',
		},
		customerContact: {
			name: 'customerContact',
			type: 'string',
			title: 'Customer Contact',
		},
	},
	required: [],
};

export const layoutData = [
	{
		id: '1',
		orderId: {
			label: 'Order 1',
			href: 'https://google.com',
		},
		pickerStatus: 'Picked',
		assignedStatus: 'Assigned',
		assignedDriverStatus: 'Assigned',
		emirate: 'Dubai',
		zone: 'Zone 1',
		deliveryDate: '2020-01-01T00:00:00.000Z',
		customerDetails: 'Customer Details',
		addressDetails: 'Address Details',
		numberOfItems: 1,
		discountCode: 'Discount Code',
		grandTotal: 100,
		currency: 'AED',
		paymentMethod: 'Cash',
		orderDate: '2020-01-01T00:00:00.000Z',
		orderStatus: 'Pending',
		warehouseStatus: 'Pending',
		pickedStatus: 'Pending',
		deliveryStatus: 'Pending',
		assignedPickerStatus: 'Pending',
		assignedDriver: 'Driver 1',
		specialInstructions: 'Special Instructions',
		area: 'Area',
		customerName: 'Customer Name',
		customerEmail: 'thisdoesnotexists@email-that-does.com',
		customerContact: '+971 123456789',
	},
];
