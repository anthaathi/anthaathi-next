import { FileUploadType, JSONSchema, JSONString } from '../../type';
import { Input } from 'baseui/input';
import { Cell } from 'baseui/layout-grid';
import { FormControl } from 'baseui/form-control';
import { Datepicker } from 'baseui/datepicker';
import { Button } from 'baseui/button';
import React, { useContext, useEffect, useId, useMemo } from 'react';
import { Select } from 'baseui/select';
import { Block } from 'baseui/block';
import { TimePicker } from 'baseui/timepicker';
import { Textarea } from 'baseui/textarea';
import { useDatasourceValues } from '../../Hooks/use-datasource-values';
import { Radio, RadioGroup } from 'baseui/radio';
import { FormLabel } from '../../Components/FormLabel';
import { useFormValue } from '../../Hooks/use-form-value';
import { FileUpload } from '../../Components/FileUpload';
import { useStyletron } from 'baseui';
import { expandBorderStyles } from 'baseui/styles';
import { FormSizeContext } from '../../Context/FormSize';
import { Editor } from '@monaco-editor/react';
import { LabelSmall, LabelXSmall } from 'baseui/typography';

export interface RenderStringProps {
	rootSchema: JSONSchema;
	field: JSONString;
	required?: boolean;
	path: string;
	onFileUpload?: FileUploadType;
	isLoading?: boolean;
}

export function RenderString(props: RenderStringProps) {
	const fieldId = useId();
	const [data, isLoading, refetch] = useDatasourceValues(
		props.field.dataSource,
	);
	const [value, setValue] = useFormValue(props.path);
	const size = useContext(FormSizeContext);

	const label = (
		<FormLabel title={props.field.title} required={props.required} />
	);

	useEffect(() => {
		refetch(value, value);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const [css, $theme] = useStyletron();

	const minDate = useMemo(() => {
		if (!props.field.formatMinimum) {
			return null;
		}

		return new Date(props.field.formatMinimum);
	}, [props.field.formatMinimum]);

	const maxDate = useMemo(() => {
		if (!props.field.formatMaximum) {
			return null;
		}

		return new Date(props.field.formatMaximum);
	}, [props.field.formatMaximum]);

	const dataValue = useMemo(() => {
		if (props.field.format !== 'date') {
			return null;
		}

		return value ? [typeof value === 'string' ? new Date(value) : value] : null;
	}, [props.field.format, value]);

	switch (props.field.format) {
		case 'date':
		case 'date-time':
			return (
				<Cell {...(props.field.cellProps ?? { span: 12 })}>
					<FormControl
						caption={props.field.caption}
						label={label}
						htmlFor={fieldId}
					>
						<div
							className={css({
								display: 'flex',
								gap: '12px',
								flexDirection: 'column',
								[$theme.mediaQuery.medium]: {
									flexDirection: 'row',
								},
							})}
						>
							<Datepicker
								placeholder={props.field.description}
								disabled={props.field.disabled}
								value={dataValue}
								size={size}
								maxDate={maxDate}
								onChange={(e) => {
									if (Array.isArray(e.date)) {
										setValue(e?.[0]);
									} else {
										setValue(e.date);
									}
								}}
								minDate={minDate}
								overrides={{
									Input: {
										props: {
											id: fieldId,
										},
									},
								}}
							/>
							{props.field.format === 'date-time' && (
								<TimePicker
									creatable
									value={dataValue}
									onChange={(date) => setValue(date)}
								/>
							)}
						</div>
					</FormControl>
				</Cell>
			);

		case 'hidden':
			return null;

		case 'submit':
			return (
				<Cell {...(props.field.cellProps ?? { span: 12 })}>
					<Block paddingTop="scale300" />
					<Button
						isLoading={props.isLoading}
						type="submit"
						disabled={props.field.disabled}
						name={props.field.title}
						size={size}
						overrides={{
							Root: {
								style: {
									width: '100%',
								},
							},
						}}
					>
						{props.field.title}
					</Button>
				</Cell>
			);

		case 'select':
			return (
				<Cell {...(props.field.cellProps ?? { span: 12 })}>
					<FormControl
						label={label}
						htmlFor={fieldId}
						caption={props.field.caption}
					>
						<Select
							value={value ? [{ id: value }] : []}
							onChange={(e) => {
								setValue(e.value?.[0]?.id);
							}}
							onInputChange={(e) => {
								refetch(e.currentTarget.value, value);
							}}
							size={size}
							autoFocus={props.field.autoFocus}
							placeholder={props.field.title}
							disabled={props.field.disabled}
							options={data?.map((res) => ({
								label: res.label,
								id: res.id,
								disabled: res.disabled,
							}))}
							required={props.required}
							id={fieldId}
							isLoading={isLoading}
						/>
					</FormControl>
				</Cell>
			);

		case 'file':
			return <FileUpload {...props} />;

		case 'time':
			return (
				<Cell {...(props.field.cellProps ?? { span: 12 })}>
					<FormControl
						label={label}
						htmlFor={fieldId}
						caption={props.field.caption}
					>
						<TimePicker
							size={size}
							value={value}
							onChange={(e) => setValue(e)}
							overrides={{
								Select: {
									props: {
										overrides: {
											Input: {
												props: {
													id: fieldId,
												},
											},
										},
									},
								},
							}}
						/>
					</FormControl>
					<Block marginBottom="scale400" />
				</Cell>
			);

		case 'json':
			return (
				<Cell {...(props.field.cellProps ?? { span: 12 })}>
					<FormControl
						htmlFor={fieldId}
						label={label}
						caption={props.field.caption}
					>
						<Editor
							language="json"
							width="calc(100% - 20px)"
							height={220}
							value={value}
							onChange={(e) => {
								setValue(e);
							}}
						/>
					</FormControl>
				</Cell>
			);

		case 'textarea':
			return (
				<Cell {...(props.field.cellProps ?? { span: 12 })}>
					<FormControl
						htmlFor={fieldId}
						label={label}
						caption={props.field.caption}
					>
						<Textarea
							size={size}
							maxLength={props.field.maxLength}
							id={fieldId}
							placeholder={props.field.description}
							autoFocus={props.field.autoFocus}
							value={value}
							onChange={(e) => setValue(e.target.value)}
						/>
					</FormControl>
				</Cell>
			);

		case 'markdown':
			return <></>;

		case 'radio':
			return (
				<Cell {...(props.field.cellProps ?? { span: 12 })}>
					<FormControl htmlFor={fieldId} label={label}>
						<RadioGroup
							id={fieldId}
							name={props.field.title}
							value={value}
							onChange={(e) => {
								setValue(e.target.value);
							}}
						>
							{data.map((res) => {
								return (
									<Radio
										value={res.id}
										name={res.label}
										disabled={res.disabled}
										key={res.id}
									>
										{res.label}
									</Radio>
								);
							})}
						</RadioGroup>
					</FormControl>
				</Cell>
			);

		case 'search':
			return (
				<Cell {...(props.field.cellProps ?? { span: 12 })}>
					<FormControl
						caption={props.field.caption}
						label={label}
						htmlFor={fieldId}
						disabled={props.field.disabled}
					>
						<Select
							size={size}
							disabled={props.field.disabled}
							id={fieldId}
							filterOptions={
								props.field.dataSource?.type === 'dynamic'
									? (options) => options
									: undefined
							}
							overrides={{
								Input: {
									props: {
										autoComplete: 'off',
									},
								},
							}}
							onInputChange={(e) => {
								refetch(e.target.value, value);
							}}
							onChange={(e) => {
								setValue(e.value?.[0]?.id);
							}}
							options={data}
							value={value ? [{ id: value }] : []}
							required={props.required}
							type="search"
							autoFocus={props.field.autoFocus}
							placeholder={props.field.description}
						/>
					</FormControl>
				</Cell>
			);

		case 'card':
			return (
				<Cell {...(props.field.cellProps ?? { span: 12 })}>
					<LabelSmall>
						<FormLabel title={props.field.title} required={props.required} />
					</LabelSmall>

					<div
						className={css({
							display: 'grid',
							gridTemplateColumns: 'repeat(auto-fill, 100%)',
							[$theme.mediaQuery.medium]: {
								gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 220px))',
							},
							gap: '16px',
							marginTop: $theme.sizing.scale600,
							marginBottom: $theme.sizing.scale600,
						})}
					>
						{data.map((res) => (
							<div
								key={res.id}
								onClick={() => {
									setValue(res.id === value ? null : res.id);
								}}
								className={css({
									padding: $theme.sizing.scale600,
									maxWidth: '220px',
									...$theme.typography.LabelMedium,
									borderRadius: '10px',
									...(value === res.id
										? expandBorderStyles({
												...$theme.borders.border200,
												borderColor: $theme.colors.accent300,
										  })
										: expandBorderStyles({
												...$theme.borders.border200,
										  })),
									cursor: 'pointer',
									userSelect: 'none',
									...(value === res.id
										? {
												backgroundColor: $theme.colors.backgroundSecondary,
										  }
										: {}),
									transitionDuration: '.1s',
									transitionTimingFunction: 'ease',
									transitionProperty: 'background-color,border',
								})}
							>
								<div>{res.label}</div>
								{res.description && (
									<LabelXSmall marginTop="scale100">
										{res.description}
									</LabelXSmall>
								)}
								{res.image && (
									<img
										src={res.image}
										className={css({
											width: '100%',
											height: 'auto',
											marginTop: '12px',
										})}
										alt={res.label}
									/>
								)}
							</div>
						))}
					</div>
				</Cell>
			);

		case 'text':
		case 'color':
		case 'email':
		case 'password':
		case 'url':
		default:
			return (
				<Cell {...(props.field.cellProps ?? { span: 12 })}>
					<FormControl
						label={label}
						caption={props.field.caption}
						htmlFor={fieldId}
						disabled={props.field.disabled}
					>
						<Input
							maxLength={props.field.maxLength}
							size={size}
							value={value ?? ''}
							onChange={(e) => {
								setValue(e.target.value);
							}}
							startEnhancer={props.field.prefix}
							endEnhancer={props.field.suffix}
							autoFocus={props.field.autoFocus}
							disabled={props.field.disabled}
							id={fieldId}
							pattern={props.field.pattern}
							required={props.required}
							type={props.field.format}
							placeholder={props.field.description}
						/>
					</FormControl>
				</Cell>
			);
	}
}
