import * as React from 'react';
import { useCallback, useMemo, useState } from 'react';
import type { FormData, FormSchema } from '../FormBuilder/types';
import { useStyletron } from 'baseui';
import { Button, KIND, SIZE } from 'baseui/button';
import { StatefulPopover } from 'baseui/popover';
import { StatefulMenu } from 'baseui/menu';
import { Select } from 'baseui/select';
import FormBuilder from '../FormBuilder';
import { LabelMedium } from 'baseui/typography';
import { Cell, Grid } from 'baseui/layout-grid';
import { FormControl } from 'baseui/form-control';
import { Add, Subtract } from '@carbon/icons-react';
import { expandBorderStyles } from 'baseui/styles';
import { Responsive } from 'baseui/layout-grid/types';

const availableOperators = [
	{ label: 'Equals', id: 'equals' },
	{ label: 'Not Equals', id: 'not-equals' },
	{ label: 'Contains', id: 'contains' },
	{ label: 'Not Contains', id: 'not-contains' },
	{ label: 'Starts With', id: 'starts-with' },
	{ label: 'Ends With', id: 'ends-with' },
	{ label: 'Is Empty', id: 'is-empty' },
	{ label: 'Is Not Empty', id: 'is-not-empty' },
];

export function FilterFieldRenderer(props: {
	filter: ConditionalFieldFilter;
	schema: FormSchema;
	onChange: (filter: ConditionalFieldFilter) => void;
	colSpan?: [Responsive<number>, Responsive<number>, Responsive<number>];
}) {
	const onChange = useCallback(
		(data: FormData) => {
			if (typeof data[props.filter.key] === 'undefined') {
				return;
			}
			props.onChange({
				...props.filter,
				value: data[props.filter.key],
			});
		},
		[props]
	);

	return (
		<Grid gridMaxWidth={0} gridMargins={0}>
			<Cell span={props.colSpan?.[0] ?? 4}>
				<FormControl label="Field">
					<Select
						options={Object.keys(props.schema.properties)
							.filter((res) => {
								return (
									['string', 'integer', 'number'].indexOf(
										props.schema.properties[res].type
									) !== -1
								);
							})
							.map((res) => ({
								label: props.schema.properties[res]?.title,
								id: res,
							}))}
						onChange={({ value }) => {
							props.onChange({
								...props.filter,
								key: value?.[0]?.id as string,
							});
						}}
						value={props.filter.key ? [{ id: props.filter.key }] : []}
					/>
				</FormControl>
			</Cell>
			<Cell span={props.colSpan?.[1] ?? 4}>
				<FormControl label="Operator">
					<Select
						options={availableOperators}
						onChange={({ value }) => {
							props.onChange({
								...props.filter,
								operator: value?.[0]?.id as string,
							});
						}}
						value={props.filter.operator ? [{ id: props.filter.operator }] : []}
						placeholder="Operator"
					/>
				</FormControl>
			</Cell>
			<Cell span={props.colSpan?.[2] ?? 4}>
				{props.filter.key && (
					<FormBuilder
						onChange={onChange}
						onSubmit={() => {}}
						defaultValue={{
							[props.filter.key]: props.filter.value,
						}}
						schema={{
							properties: {
								[props.filter.key]: {
									...props.schema.properties[props.filter.key],
									colSpan: 12,
									description: '',
									name: props.filter.key,
								},
							},
							required: [props.filter.key],
						}}
					/>
				)}
			</Cell>
		</Grid>
	);
}

export function FilterGroupRender(props: {
	filter: ConditionalAndFilter | ConditionalOrFilter;
	onChange: (filter: ConditionalAndFilter | ConditionalOrFilter) => void;
	schema: FormSchema;
}) {
	const [css, $theme] = useStyletron();

	const changeValue = useCallback(
		(filter: ComposedFilter, index: number) => {
			switch (filter.$kind) {
				case 'and':
					(props.filter as ConditionalAndFilter).and[index] = filter;
					break;
				case 'or':
					(props.filter as ConditionalAndFilter).and[index] = filter;
					break;
				case 'field':
					(props.filter as ConditionalAndFilter).and[index] = filter;
					break;
			}
			props.onChange(props.filter);
		},
		[props]
	);

	return (
		<>
			<div
				className={css({
					border: '1px solid #EEE',
					padding: $theme.sizing.scale500,
					borderRadius: $theme.sizing.scale500,
				})}
			>
				<LabelMedium $style={{ textTransform: 'capitalize' }}>
					{props.filter.$kind}
				</LabelMedium>
				{props.filter.$kind === 'and' && (
					<>
						{props.filter.and.map((res, index) => {
							return (
								<RenderDynamicFilter
									key={index}
									filter={res}
									schema={props.schema}
									onChange={(filter) => {
										changeValue(filter, index);
									}}
								/>
							);
						})}
					</>
				)}

				{props.filter.$kind === 'or' &&
					props.filter.or.map((res, index) => {
						return (
							<RenderDynamicFilter
								key={index}
								filter={res}
								schema={props.schema}
								onChange={(filter) => changeValue(filter, index)}
							/>
						);
					})}

				<StatefulPopover
					content={({ close }) => {
						return (
							<StatefulMenu
								onItemSelect={({ item }) => {
									if (!item.default) {
										return;
									}
									if (props.filter.$kind === 'and') {
										props.filter.and = props.filter.and || [];
										props.filter.and.push({
											...item.default,
										});
									} else if (props.filter.$kind === 'or') {
										props.filter.or = props.filter.or || [];
										props.filter.or.push({
											...item.default,
										});
									}
									props.onChange(props.filter);
									close();
								}}
								items={[
									...Object.keys(props.schema.properties).map((res) => ({
										label: props.schema.properties[res].title,
										kind: 'field',
										key: res,
										default: {
											$kind: 'field',
											key: res,
											operator: 'equals',
											value: '',
										} as ConditionalFieldFilter,
									})),
									{ divider: true, key: 'divider' },
									{
										key: 'field',
										label: 'Field',
										default: {
											$kind: 'field',
											key: '',
											value: '',
											operator: 'equals',
										},
									},
									{
										key: 'and',
										label: 'And',
										default: {
											$kind: 'and',
											and: [],
										},
									},
									{
										key: 'or',
										label: 'Or',
										default: {
											$kind: 'or',
											or: [],
										},
									},
								]}
							/>
						);
					}}
					placement="bottom"
				>
					<Button size={SIZE.compact}>Add filter</Button>
				</StatefulPopover>
			</div>
		</>
	);
}

export function RenderDynamicFilter(props: {
	filter: ComposedFilter;
	onChange: (filter: ComposedFilter) => void;
	schema: FormSchema;
}) {
	switch (props.filter.$kind) {
		case 'field':
			return (
				<>
					<FilterFieldRenderer
						filter={props.filter}
						onChange={props.onChange}
						schema={props.schema}
					/>
				</>
			);
		case 'and':
		case 'or':
			return (
				<FilterGroupRender
					filter={props.filter}
					schema={props.schema}
					onChange={props.onChange}
				/>
			);
	}

	throw new Error('Invalid filter');
}

export function RenderSimpleUI(props: {
	filter: ComposedFilter;
	onChange: (filter: ComposedFilter) => void;
	schema: FormSchema;
}) {
	const [css, $theme] = useStyletron();
	const [selectedIndex, setSelectedIndex] = useState<null | number>(0);

	const fields = useMemo(() => {
		if (props.filter.$kind !== 'and') {
			return [];
		}
		return (
			props.filter.and
				.map((res) => {
					if (res.$kind !== 'field') {
						return null;
					}

					return res.key;
				})
				.filter((res) => res !== null) as string[]
		).map((res, index) => {
			return {
				id: res,
				label: props.schema.properties[res]?.title ?? 'No Column',
				index,
				$active: index === selectedIndex,
			};
		});
	}, [props.filter, props.schema.properties, selectedIndex]);

	return (
		<div
			className={css({
				...expandBorderStyles($theme.borders.border300),
			})}
		>
			<div
				className={css({
					display: 'flex',
					width: '100%',
					minHeight: '230px',
				})}
			>
				<div
					className={css({
						display: 'flex',
						flexDirection: 'column',
						width: '50%',
						borderRight: '1px solid #EEE',
					})}
				>
					<StatefulMenu
						onItemSelect={({ item }) => {
							setSelectedIndex(item.index);
						}}
						overrides={{
							List: {
								style: {
									boxShadow: 'none',
								},
							},
							ListItem: {
								style: ({ $active, $isHighlighted }) => {
									return {
										backgroundColor: $isHighlighted ? '#EEE' : 'transparent',
									};
								},
							},
						}}
						items={fields}
					/>

					<span className={css({ flexGrow: 1 })} />

					<div
						className={css({
							display: 'flex',
							borderTop: '1px solid #EEE',
							padding: $theme.sizing.scale500,
						})}
					>
						<Button
							size={SIZE.compact}
							kind={KIND.secondary}
							onClick={() => {
								props.filter.$kind === 'and' &&
									props.filter.and.push({
										$kind: 'field',
										key: props.schema.properties[
											Object.keys(props.schema.properties)?.[0]
										]?.name,
										name: '',
										value: '',
										operator: 'equals',
									});
								props.onChange(props.filter);
							}}
						>
							<Add />
						</Button>
						<span className={css({ width: '6px' })} />
						<Button
							size={SIZE.compact}
							onClick={() => {
								if (!selectedIndex) {
									return;
								}
								props.filter.$kind === 'and' &&
									(props.filter.and = props.filter.and.filter(
										(_, index) => index !== selectedIndex
									));

								props.onChange(props.filter);
							}}
							kind={KIND.secondary}
						>
							<Subtract />
						</Button>
					</div>
				</div>
				<div
					className={css({
						width: '50%',
						padding: '1rem',
					})}
				>
					{typeof selectedIndex === 'number' &&
					props.filter.$kind === 'and' &&
					props.filter.and?.[selectedIndex]?.$kind === 'field' ? (
						<FilterFieldRenderer
							filter={
								props.filter.and?.[selectedIndex] as ConditionalFieldFilter
							}
							onChange={(filter) => {
								props.filter.$kind === 'and' &&
									props.filter.and?.[selectedIndex] &&
									(props.filter.and[selectedIndex] = filter);
								props.onChange(props.filter);
							}}
							schema={props.schema}
							colSpan={[12, 6, 6]}
						/>
					) : (
						<p>Please</p>
					)}
				</div>
			</div>
		</div>
	);
}

export function Filter({
	filter,
	onChange,
	schema,
	simpleUI,
}: {
	filter: ComposedFilter;
	onChange: (input: ComposedFilter) => void;
	schema: FormSchema;
	simpleUI?: boolean;
}) {
	return (
		<>
			{simpleUI ? (
				<RenderSimpleUI
					filter={filter}
					onChange={(prev) => {
						onChange({
							...prev,
						});
					}}
					schema={schema}
				/>
			) : (
				<RenderDynamicFilter
					filter={filter}
					onChange={(prev) => {
						onChange({
							...prev,
						});
					}}
					schema={schema}
				/>
			)}
		</>
	);
}

export type ComposedFilter =
	| ConditionalOrFilter
	| ConditionalAndFilter
	| ConditionalFieldFilter
	| RowFilter;

export interface ConditionalOrFilter {
	$kind: 'or';
	or: ComposedFilter[];
}

export interface ConditionalAndFilter {
	$kind: 'and';
	and: ComposedFilter[];
}

export interface RowFilter {
	$kind: 'row';
}

export interface ConditionalFieldFilter {
	$kind: 'field';
	key: string;
	value: string;
	name: React.ReactNode;
	operator: string;
}
