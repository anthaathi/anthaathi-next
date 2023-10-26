import { FormControl } from 'baseui/form-control';
import { Input } from 'baseui/input';
import { Checkbox } from 'baseui/checkbox';
import React, {
	useCallback,
	memo,
	useEffect,
	useId,
	useMemo,
	useState,
	useRef,
} from 'react';
import * as Yup from 'yup';
import { TimePicker } from 'baseui/timepicker';
import { Datepicker } from 'baseui/datepicker';
import { Cell, Grid } from 'baseui/layout-grid';
import { Select } from 'baseui/select';
import { STYLE_TYPE } from 'baseui/checkbox/constants';
import { Radio, RadioGroup } from 'baseui/radio';
import {
	ArrayDynamicField,
	ArrayField,
	BooleanField,
	DefaultField,
	FormData,
	FormErrors,
	FormField,
	FormSchema,
	LinkField,
	NumberField,
	SectionField,
	StringField,
	SubmitFormButton,
} from './types';
import { useDataSource } from '../Datasource';
import { Button } from 'baseui/button';
import { useInitialValue } from '../DataCommon/hooks/initial-value';
import { useConditionalSchemaProperties } from '../DataCommon/hooks/use-conditional-schema-properties';
import { hasChanged } from '../DataCommon/utils/has-changed';
import { useStyletron } from 'baseui';
import { MarkdownEditor } from '../MarkdownEditor';

export type EnumType = { values?: object; isLoading?: boolean; error?: any };

export interface FormBuilderProps {
	schema: FormSchema;
	onSubmit: (data: FormData) => void;
	onChange?: (data: FormData) => void;
	submitButtonLabel?: string;
	defaultValue?: FormData;
	/**
	 * @deprecated
	 */
	formId?: string;
	isSubmitting?: boolean;
}

/**
 * This is a FormBuilder component that allows you to create a form based on a JSON schema. It provides form controls
 * for various data types, including text input, checkbox, time picker, date picker, select, radio, and more.
 * It also integrates with the useDataSource hook, which allows you to fetch data from a data source and use it to populate form options dynamically.
 * @param schema a JSON schema object that defines the structure and validation rules of the form fields.
 * @param onSubmit a callback function that is called when the form is submitted. It is passed the form data as an argument.
 * @param isSubmitting a boolean value that indicates whether the form is currently submitting. If true, the submit button will be disabled.
 * @param defaultValue an object containing default values for the form fields.
 * @param formId a string that is used as a prefix for the form field IDs (defaults to "form_builder_").
 * @param onChange
 * @constructor
 */
const FormBuilder = ({
	schema,
	onSubmit,
	isSubmitting,
	defaultValue = {},
	onChange,
}: FormBuilderProps) => {
	const formId = useId();

	const initialValues = useInitialValue(schema, defaultValue);
	const [formData, setFormData] = useState<FormData>(initialValues ?? {});

	const [errors, setErrors] = useState<FormErrors>({});

	const { fetchData: _fetchData } = useDataSource();

	const fetchData = useCallback(
		(dataSourceKey: string, formData: FormData) =>
			_fetchData(dataSourceKey, formData)!!,
		[_fetchData]
	);

	const [enumValues, setEnumValues] = useState<Record<string, EnumType>>({});

	const isMounted = useRef(true);

	const dataLoadedOnce = useRef(false);

	useEffect(() => {
		isMounted.current = true;
		return () => {
			isMounted.current = false;
		};
	});

	const previousFormData = useRef<FormData>(formData);

	useEffect(() => {
		Object.entries(schema.properties).forEach(([key, field]) => {
			if (field.type === 'array' && field.dataSource === 'dynamic') {
				if (
					!hasChanged(
						formData,
						previousFormData.current,
						(field as never as ArrayDynamicField).dependsOn
							? [
									...((field as never as ArrayDynamicField).dependsOn || []),
									field.name,
							  ]
							: Object.keys(formData).filter((res) => res !== field.name)
					) &&
					dataLoadedOnce.current
				) {
					return;
				}

				if (!(field as never as ArrayDynamicField).dataSourceKey) {
					return;
				}

				setEnumValues((prev) => {
					prev[key] = {
						isLoading: true,
						values: prev[key]?.values,
						error: prev[key]?.error,
					};
					return {
						...prev,
					};
				});

				fetchData?.(
					(field as never as ArrayDynamicField).dataSourceKey,
					formData
				)
					.then((values) => {
						if (!isMounted.current) {
							return;
						}

						setEnumValues((prev) => {
							if (!Array.isArray(values)) {
								console.warn(
									`The data source for ${key} did not return an array.`,
									values
								);
								return prev;
							}

							prev[key] = { values };
							return {
								...prev,
							};
						});
					})
					.catch((error) => {
						if (!isMounted.current) {
							return;
						}

						setEnumValues((prev) => {
							prev[key] = { error };
							return {
								...prev,
							};
						});
					})
					.finally(() => {
						if (!isMounted.current) {
							return;
						}

						setEnumValues((prev) => {
							prev[key].isLoading = false;
							return {
								...prev,
							};
						});
					});
			}
		});

		dataLoadedOnce.current = true;

		previousFormData.current = formData;
	}, [fetchData, formData, schema.properties]);

	// Create a Yup validation schema from the JSONSchema object
	const validationSchema = useMemo(
		() =>
			Yup.object().shape(
				Object.keys(schema.properties).reduce(
					(acc: Record<string, any>, field) => {
						const fieldSchema = schema.properties[field];

						if (
							fieldSchema.type === 'string' &&
							fieldSchema.format === 'email'
						) {
							acc[field] = Yup.string().label(fieldSchema.title).email();
						} else if (
							fieldSchema.type === 'string' &&
							fieldSchema.format === 'date-time'
						) {
							acc[field] = Yup.date().label(fieldSchema.title);
						} else if (fieldSchema.type === 'string') {
							acc[field] = Yup.string().label(fieldSchema.title);
						} else if (fieldSchema.format === 'date-time') {
							acc[field] = Yup.date().label(fieldSchema.title);
						} else if (fieldSchema.type === 'integer') {
							acc[field] = Yup.number().label(fieldSchema.title).integer();
						} else if (fieldSchema.type === 'number') {
							acc[field] = Yup.number().label(fieldSchema.title);
						} else if (fieldSchema.type === 'boolean') {
							acc[field] = Yup.boolean().label(fieldSchema.title);
						} else if (fieldSchema.type === 'array') {
							acc[field] = Yup.array().label(fieldSchema.title);
						} else if (fieldSchema.type === 'object') {
							acc[field] = Yup.object().label(fieldSchema.title);
						}

						if (schema.required?.indexOf(field) !== -1 && acc[field]) {
							acc[field] = acc[field].required();
						}

						return acc;
					},
					{}
				)
			),
		[schema.properties, schema.required]
	);

	const handleChange = useCallback((event: any) => {
		const { name, value, type, checked } = event.target;
		setFormData((prev) => {
			return {
				...prev,
				[name]: type === 'checkbox' ? checked : value,
			};
		});
	}, []);

	useEffect(() => {
		onChange?.(formData);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formData]);

	const handleBlur = useCallback(
		(event: any) => {
			const { name } = event.target;
			validationSchema
				.validateAt(name, formData)
				.then(() => setErrors({ ...errors, [name]: '' }))
				.catch((err) => setErrors({ ...errors, [name]: err.errors[0] }));
		},
		[errors, formData, validationSchema]
	);

	const handleSubmit = useCallback(
		(event: any) => {
			event.preventDefault();

			if (isSubmitting) {
				return;
			}

			validationSchema
				.validate(formData, { abortEarly: false })
				.then(() => {
					onSubmit(formData);
				})
				.catch((err) => {
					const errors = err.inner.reduce(
						(acc: Record<string, string>, fieldError: Yup.ValidationError) => {
							acc[fieldError.path ?? ''] = fieldError.message;
							return acc;
						},
						{}
					);
					setErrors(errors);
				});
		},
		[formData, isSubmitting, onSubmit, validationSchema]
	);

	const [css, $theme] = useStyletron();

	const renderSubmitField = useCallback(
		(field: SubmitFormButton & DefaultField) => (
			<Button
				type="submit"
				isLoading={isSubmitting}
				overrides={{ Root: { style: { width: '100%' } } }}
			>
				{field.title}
			</Button>
		),
		[isSubmitting]
	);

	const renderSectionField = useCallback(
		(field: SectionField & DefaultField) => (
			<h3
				className={css({
					marginTop: 0,
					marginBottom: 0,
					...$theme.typography.HeadingMedium,
				})}
			>
				{field.title}
			</h3>
		),
		[$theme.typography.HeadingMedium, css]
	);

	const renderArrayField = useCallback(
		(field: ArrayField) => {
			return (
				<FormControl
					htmlFor={formId + field.name}
					caption={field.description}
					data-testid="form-field"
					label={field.title}
					key={field.title}
					overrides={{
						ControlContainer: {
							props: {
								'data-testid': 'form-field',
							},
						},
					}}
					error={errors[field.name]}
				>
					<Select
						multi={field.isMulti}
						id={formId + field.name}
						value={formData[field.name] ?? []}
						overrides={{
							Input: {
								props: {
									name: field.name,
								},
							},
						}}
						creatable={field.creatable}
						onBlur={handleBlur}
						onChange={(event) => {
							switch (event.type) {
								case 'select':
									setFormData((prevData) => ({
										...prevData,
										[field.name]: event.value.map((res) =>
											event.option?.isCreatable
												? {
														id: res[field.valueKey || 'id'],
														label: res[field.labelKey || 'label'],
												  }
												: {
														id: res.id,
												  }
										),
									}));
									break;
								case 'clear':
									setFormData((prevData) => ({
										...prevData,
										[field.name]: [],
									}));
									break;
								case 'remove':
									setFormData((prevState) => ({
										...prevState,
										[field.name]: (prevState[field.name] || []).filter(
											(res: any) =>
												res[field.valueKey || 'id'] !== event.option?.id
										),
									}));
							}
						}}
						options={
							(enumValues?.[field.name]?.values ?? field.enum ?? []) as any[]
						}
						valueKey={field.valueKey ?? 'value'}
						labelKey={field.labelKey ?? 'id'}
						isLoading={enumValues?.[field.name]?.isLoading}
						error={Boolean(errors[field.name])}
					/>
				</FormControl>
			);
		},
		[enumValues, errors, formData, formId, handleBlur]
	);

	const renderBooleanField = useCallback(
		(field: BooleanField & DefaultField) => (
			<FormControl
				htmlFor={formId + field.name}
				caption={field.description}
				data-testid="form-field"
				label={field.title}
				key={field.title}
				overrides={{
					ControlContainer: {
						props: {
							'data-testid': 'form-field',
						},
					},
				}}
				error={errors[field.name]}
			>
				<Checkbox
					checkmarkType={
						field.format === 'checkbox'
							? STYLE_TYPE.toggle_round
							: STYLE_TYPE.default
					}
					overrides={{
						Input: {
							props: {
								id: formId + field.name,
								name: field.name,
							},
						},
					}}
					checked={formData[field.name]}
					onChange={(e) => {
						setFormData({ ...formData, [field.name]: e.target.checked });
					}}
					onBlur={handleBlur}
					{...field.inputProps}
				/>
			</FormControl>
		),
		[errors, formData, formId, handleBlur]
	);

	const renderNumberField = useCallback(
		(field: NumberField & DefaultField) => (
			<FormControl
				htmlFor={formId + field.name}
				caption={field.description}
				data-testid="form-field"
				label={field.title}
				key={field.title}
				overrides={{
					ControlContainer: {
						props: {
							'data-testid': 'form-field',
						},
					},
				}}
				error={errors[field.name]}
			>
				<Input
					type="number"
					id={formId + field.name}
					name={field.name}
					value={formData[field.name]}
					onChange={handleChange}
					onBlur={handleBlur}
					{...field.inputProps}
				/>
			</FormControl>
		),
		[errors, formData, formId, handleBlur, handleChange]
	);

	const renderStringField = useCallback(
		(field: (StringField | LinkField) & DefaultField) => {
			if (field.enum) {
				if (field.format === 'radio') {
					return (
						<FormControl
							htmlFor={formId + field.name}
							caption={field.description}
							data-testid="form-field"
							label={field.title}
							key={field.title}
							overrides={{
								ControlContainer: {
									props: {
										'data-testid': 'form-field',
									},
								},
							}}
							error={errors[field.name]}
						>
							<RadioGroup
								id={formId + field.name}
								value={formData[field.name]}
								onChange={(e) => {
									setFormData({
										...formData,
										[field.name]: e.target.value,
									});
								}}
							>
								{field.enum?.map((value) => (
									<Radio
										key={value}
										value={value}
										onChange={handleChange}
										onBlur={handleBlur}
										{...field.inputProps}
									>
										{value}
									</Radio>
								))}
							</RadioGroup>
						</FormControl>
					);
				}
				return (
					<FormControl
						htmlFor={formId + field.name}
						caption={field.description}
						data-testid="form-field"
						label={field.title}
						key={field.title}
						overrides={{
							ControlContainer: {
								props: {
									'data-testid': 'form-field',
								},
							},
						}}
						error={errors[field.name]}
					>
						<Select
							id={formId + field.name}
							value={formData[field.name] ? [{ id: formData[field.name] }] : []}
							overrides={{
								Input: {
									props: {
										name: field.name,
									},
								},
							}}
							onBlur={handleBlur}
							onChange={(event) => {
								setFormData({
									...formData,
									[field.name]: event.value?.[0].id,
								});
							}}
							{...field.inputProps}
							options={field.enum?.map((value) => ({
								label: value,
								id: value,
							}))}
						/>
					</FormControl>
				);
			}

			if (field.format === 'markdown') {
				return (
					<FormControl
						htmlFor={formId + field.name}
						caption={field.description}
						data-testid="form-field"
						label={field.title}
						key={field.title}
						overrides={{
							ControlContainer: {
								props: {
									'data-testid': 'form-field',
								},
							},
						}}
						error={errors[field.name]}
					>
						<MarkdownEditor
							onBlur={() => handleBlur({ target: { name: field.name } })}
							id={formId + field.name}
							value={formData[field.name]}
							onChange={(_value) => {
								setFormData((prevState) => ({
									...prevState,
									[field.name]: _value,
								}));
							}}
							{...field.inputProps}
						/>
					</FormControl>
				);
			} else if (field.format === 'date-time') {
				return (
					<FormControl
						htmlFor={formId + field.name}
						caption={field.description}
						data-testid="form-field"
						label={field.title}
						key={field.title}
						overrides={{
							ControlContainer: {
								props: {
									'data-testid': 'form-field',
								},
							},
						}}
						error={errors[field.name]}
					>
						<Datepicker
							overrides={{
								Input: {
									props: {
										id: formId + field.name,
									},
								},
							}}
							onClose={() => {
								handleBlur({ target: { name: field.name } });
							}}
							value={formData[field.name] ?? []}
							onChange={(value) => {
								setFormData({ ...formData, [field.name]: value.date });
							}}
							{...field.inputProps}
						/>
					</FormControl>
				);
			} else if (field.format === 'time') {
				return (
					<FormControl
						htmlFor={formId + field.name}
						caption={field.description}
						data-testid="form-field"
						label={field.title}
						key={field.title}
						overrides={{
							ControlContainer: {
								props: {
									'data-testid': 'form-field',
								},
							},
						}}
						error={errors[field.name]}
					>
						<TimePicker
							overrides={{
								Select: {
									props: {
										id: formId + field.name,
									},
								},
							}}
							error={Boolean(errors[field.name])}
							value={formData[field.name]}
							onChange={(value) =>
								setFormData({ ...formData, [field.name]: value })
							}
							{...field.inputProps}
						/>
					</FormControl>
				);
			} else {
				return (
					<FormControl
						htmlFor={formId + field.name}
						caption={field.description}
						data-testid="form-field"
						label={field.title}
						key={field.title}
						overrides={{
							ControlContainer: {
								props: {
									'data-testid': 'form-field',
								},
							},
						}}
						error={errors[field.name]}
					>
						<Input
							id={formId + field.name}
							name={field.name}
							value={formData[field.name]}
							type={field.format}
							onChange={handleChange}
							onBlur={handleBlur}
							{...field.inputProps}
						/>
					</FormControl>
				);
			}
		},
		[errors, formData, formId, handleBlur, handleChange]
	);
	const renderField = useCallback(
		(field: FormField) => {
			switch (field.type) {
				case 'submit':
					return renderSubmitField(field);

				case 'section':
					return renderSectionField(field);

				case 'string':
				case 'link':
					return renderStringField(field);

				case 'number':
					return renderNumberField(field);

				case 'boolean':
					return renderBooleanField(field);

				case 'array':
					return renderArrayField(field);

				case 'divider':
					return (
						<div
							className={css({ width: '100%', borderBottom: '1px solid #EEE' })}
						/>
					);

				default:
					return null;
			}
		},
		[
			css,
			renderArrayField,
			renderBooleanField,
			renderNumberField,
			renderSectionField,
			renderStringField,
			renderSubmitField,
		]
	);

	const formFields = useConditionalSchemaProperties(schema, formData);

	return (
		<form
			onSubmit={handleSubmit}
			data-testid="form"
			className={css({ width: '100%' })}
		>
			<Grid gridGaps={4} gridColumns={12} gridMargins={0} gridMaxWidth={0}>
				{Object.keys(formFields).map((fieldKey) => {
					const field = schema.properties[fieldKey];

					return (
						<Cell span={field.colSpan ?? 12} key={field.name}>
							{renderField(schema.properties[fieldKey])}
						</Cell>
					);
				})}
			</Grid>
		</form>
	);
};

export default memo(FormBuilder);
