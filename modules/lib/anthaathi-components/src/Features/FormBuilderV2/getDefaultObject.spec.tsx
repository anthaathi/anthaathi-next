import '@testing-library/jest-dom';

describe('GetDefaultObject', function () {
	it('should ', function () {
		// 	const d = getDefaultObject({
		// 		type: 'object',
		// 		properties: {
		// 			identification: {
		// 				type: 'object',
		// 				title: 'Identification',
		// 				required: [],
		// 				expandable: true,
		// 				properties: { title: { type: 'string', title: 'Title' } },
		// 			},
		// 			breadcrumb: {
		// 				type: 'object',
		// 				title: 'Breadcrumb',
		// 				required: ['breadcrumb'],
		// 				initialExpanded: false,
		// 				expandable: true,
		// 				properties: {
		// 					breadcrumbs: {
		// 						title: 'Breadcrumb',
		// 						type: 'array',
		// 						items: {
		// 							type: 'object',
		// 							properties: {
		// 								title: { type: 'string', title: 'Title' },
		// 								path: { type: 'string', title: 'Path' },
		// 							},
		// 							required: [],
		// 						},
		// 					},
		// 				},
		// 			},
		// 			toolbarBar: {
		// 				type: 'object',
		// 				title: 'Toolbar',
		// 				expandable: true,
		// 				initialExpanded: false,
		// 				properties: {
		// 					tab: {
		// 						title: 'Tabs',
		// 						type: 'array',
		// 						items: {
		// 							type: 'object',
		// 							properties: {
		// 								title: { type: 'string', title: 'Title' },
		// 								to: { type: 'string', title: 'To' },
		// 							},
		// 							required: [],
		// 						},
		// 					},
		// 				},
		// 				required: [],
		// 			},
		// 			pageConfig: {
		// 				type: 'object',
		// 				title: 'Page config',
		// 				expandable: true,
		// 				initialExpanded: false,
		// 				required: [],
		// 				properties: {
		// 					fullWidth: { type: 'boolean', title: 'Full width' },
		// 					center: { type: 'boolean', title: 'Center' },
		// 					maxWidth: { type: 'string', title: 'Max width' },
		// 				},
		// 			},
		// 		},
		// 		required: [],
		// 	}, null);
		//
		// 	expect(d).toMatchSnapshot();
		//
		// 	const result = getDefaultObject({
		// 		title: 'Product',
		// 		type: 'array',
		// 		items: {
		// 			type: 'object',
		// 			properties: {
		// 				title: {
		// 					title: 'Type',
		// 					type: 'string',
		// 					format: 'select',
		// 					dataSource: {
		// 						type: 'static',
		// 						values: [
		// 							{
		// 								id: 'string',
		// 								label: 'String',
		// 							},
		// 						],
		// 					},
		// 				},
		// 			},
		// 			required: [],
		// 		},
		// 		format: 'panel',
		// 	});
		//
		// 	expect(result).toMatchSnapshot();
		// });
		//
		// it('should work when there is anyOf, allOf none', function () {
		// 	const data = getDefaultObject({
		// 		type: 'object',
		// 		$defs: {
		// 			omkar: {
		// 				type: 'object',
		// 				properties: {
		// 					name: {
		// 						title: 'Omkar',
		// 						type: 'string',
		// 						default: 'Omkar',
		// 					}
		// 				}
		// 			}
		// 		},
		// 		properties: {
		// 			flowers: {
		// 				oneOf: [
		// 					{
		// 						type: 'object',
		// 						properties: {
		// 							flower: {
		// 								title: 'Flower',
		// 								type: 'string',
		// 								dataSource: {
		// 									type: 'static',
		// 									values: [
		// 										{
		// 											id: 'Omkar',
		// 											label: 'Omkar',
		// 										},
		// 									],
		// 								},
		// 							},
		// 							dance: {
		// 								type: 'string',
		// 								title: 'Dance',
		// 							},
		// 						},
		// 					},
		// 					{
		// 						type: 'object',
		// 						properties: {
		// 							flower: {
		// 								title: 'Flower',
		// 								type: 'string',
		// 								dataSource: {
		// 									type: 'static',
		// 									values: [
		// 										{
		// 											id: '2',
		// 											label: '2',
		// 										},
		// 									],
		// 								},
		// 							},
		// 							igotIt: {
		// 								const: 'iGotIt',
		// 							},
		// 							ref: {
		// 								$ref: '#/definitions/omkar'
		// 							}
		// 						},
		// 					},
		// 				],
		// 			},
		// 		},
		// 	});
		//
		// 	expect(data).toMatchSnapshot();
	});
});
