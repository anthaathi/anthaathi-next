import { useStyletron } from 'baseui';
import { FormSchema, NumberField, StringField } from '../FormBuilder/types';
import {
	ConditionalSchemaPropertiesReturn,
	useConditionalSchemaProperties,
} from '../DataCommon/hooks/use-conditional-schema-properties';
import { Button, KIND, SIZE } from 'baseui/button';
import React, { useMemo, useState } from 'react';
import { StatefulPopover } from 'baseui/popover';
import { StatefulMenu } from 'baseui/menu';
import { OverflowMenuVertical, Reset } from '@carbon/icons-react';
import { Checkbox } from 'baseui/checkbox';
import { DataTableWrapper } from './components/data-table-wrapper';
import { SearchContainer } from './components/search-container';
import { ToolbarAction } from './components/toolbar-action';
import { TableHeadCellContent } from './components/table-head-cell-content';
import { Toolbar } from './components/toolbar';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeadCell,
	TableRow,
} from './components/styled-tables';
import {
	DataTableConfig,
	useDatatableConfig,
} from './context/use-datatable-context';
import { ShowAppliedFilters } from './components/show-applied-filters';
import { Link } from 'react-router-dom';
import { StyledLink } from 'baseui/link';
import { Badge } from 'baseui/badge';
import { Block } from 'baseui/block';

export type RefetchFunction = (config: DataTableConfig) => void;

export interface DataTableProps {
	data: { [key: string]: any; id: string }[];
	schema: FormSchema;
	sortable?: boolean;
	sortKey?: string;
	sortDirection?: 'asc' | 'desc';
	onSortChange?: (sortKey: string, sortDirection: 'asc' | 'desc') => void;
	actions?: { label: string; actionId: string }[];
	onAction?: (input: string[], actionId: string) => void;
	selectable?: boolean;
	refetch?: RefetchFunction;
}

export function useFilteredAndSortedColumns(
	formFields: ConditionalSchemaPropertiesReturn
): ConditionalSchemaPropertiesReturn {
	const { config } = useDatatableConfig();

	return useMemo(() => {
		const result: ConditionalSchemaPropertiesReturn = {};

		Object.keys(formFields)
			.filter((key) => config.columnConfig[key]?.visible ?? true)
			.forEach((res) => {
				result[res] = formFields[res];
			});

		return result;
	}, [config.columnConfig, formFields]);
}

export default function DataTable({
	schema,
	data,
	selectable,
	actions,
	onAction,
	refetch,
}: DataTableProps) {
	const _formFields = useConditionalSchemaProperties(schema, {});
	const formFields = useFilteredAndSortedColumns(_formFields);

	const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
	const [activeHeaderItem, setActiveHeaderItem] = useState<string | null>(null);
	const [css, $theme] = useStyletron();

	const { setConfig, config } = useDatatableConfig();

	return (
		<DataTableWrapper>
			<Toolbar>
				<SearchContainer refetch={refetch} schema={formFields} />
				<span className={css({ width: '6px' })}></span>
				<Block padding="scale200">
					<ToolbarAction refetch={refetch} schema={schema} />
				</Block>
				<span className={css({ flexGrow: 1 })} />
				{Object.keys(checkedItems).filter((res) => checkedItems[res]).length >
					0 &&
					config.mode === 'select' && (
						<StatefulPopover
							content={({ close }) => (
								<StatefulMenu
									items={actions?.map((res) => ({ label: res.label })) || []}
									onItemSelect={({ item }) => {
										onAction?.(Object.keys(checkedItems), item.itemId);
										close();
									}}
								/>
							)}
							placement="bottomLeft"
						>
							<Button size={SIZE.compact} kind={KIND.secondary}>
								<OverflowMenuVertical />
							</Button>
						</StatefulPopover>
					)}

				<span className={css({ width: '6px' })} />

				<Block padding="scale200">
					<Button
						size={SIZE.compact}
						startEnhancer={<Reset />}
						kind={KIND.secondary}
						onClick={() => {
							setConfig((prev) => ({
								...prev,
								filters: {
									$kind: 'and',
									and: [],
								},
							}));
						}}
						overrides={{
							Root: {
								style: {
									width: '100%',
								},
							},
							StartEnhancer: {
								style: {
									marginRight: $theme.sizing.scale200,
								},
							},
						}}
					>
						Reset
					</Button>
				</Block>
				<span className={css({ height: '6px' })}></span>

				<span className={css({ width: '6px' })}></span>
			</Toolbar>

			<Toolbar>
				<ShowAppliedFilters schema={schema} />
			</Toolbar>

			<div
				className={css({
					width: '100%',
					overflowX: 'auto',
				})}
			>
				<Table>
					<TableHead>
						<TableRow>
							{selectable && config.mode === 'select' && (
								<TableHeadCell $align="center" $style={{ width: '12px' }}>
									<Checkbox
										checked={
											Object.keys(checkedItems).filter(
												(res) => checkedItems[res]
											).length === data.length
										}
										onChange={(e) => {
											if (e.target.checked) {
												const allItems: Record<string, boolean> = {};
												data.forEach((item) => {
													allItems[item.id] = true;
												});
												setCheckedItems(allItems);
											} else {
												setCheckedItems({});
											}
										}}
									/>
								</TableHeadCell>
							)}
							{Object.keys(formFields).map((column) => (
								<TableHeadCellContent
									key={column}
									setSort={(direction) => {
										setConfig((prev) => ({
											...prev,
											sort: {
												column: column,
												direction: direction,
											},
										}));
									}}
									setActiveHeaderItem={setActiveHeaderItem}
									sortDirection={config.sort?.direction ?? null}
									sortKey={config.sort?.column ?? null}
									activeHeaderItem={activeHeaderItem}
									formFields={formFields}
									column={column}
								/>
							))}
							{actions && (
								<TableHeadCell
									scope="col"
									$align="center"
									$style={{
										width: '12px',
										position: 'sticky',
										right: 0,
										top: 0,
										zIndex: 2,
										backgroundColor: $theme.colors.backgroundSecondary,
										border: '1px solid #ddd',
									}}
								>
									Actions
								</TableHeadCell>
							)}
						</TableRow>
					</TableHead>
					<TableBody>
						{data.map((row) => (
							<TableRow key={row.id}>
								{selectable && config.mode === 'select' && (
									<TableCell $align="center">
										<Checkbox
											checked={checkedItems[row.id]}
											onChange={(e) =>
												setCheckedItems((prev) => ({
													...prev,
													[row.id]: e.target.checked,
												}))
											}
										/>
									</TableCell>
								)}
								{Object.keys(formFields).map((column) => {
									const value = row[column];

									let returnValue: React.ReactNode = value;

									switch (formFields[column].type) {
										case 'link':
											if (value) {
												returnValue = (
													<StyledLink
														$as={
															value.to?.startsWith('http://') ||
															value.to?.startsWith('https://') ||
															value.to?.startsWith('mailto:') ||
															value.to?.startsWith('tel:')
																? 'a'
																: Link
														}
														/**
                             @ts-ignore */
														to={value.to}
														href={value.to}
													>
														{value.label}
													</StyledLink>
												);
											} else {
												returnValue = null;
											}
											break;

										case 'string':
											const formField = formFields[column] as StringField;
											switch (formField.format) {
												case 'tag':
													const tagColorColumn = formField.tagColorColumn;

													returnValue = (
														<Badge
															color={
																row[tagColorColumn ?? ''] ??
																formField.defaultTagColor
															}
															content={value}
														/>
													);
													break;

												case 'email':
													returnValue = (
														<StyledLink href={`mailto:${value}`}>
															{value}
														</StyledLink>
													);
													break;

												case 'date-time':
													let dateTime = '';
													if (value) {
														dateTime = Intl.DateTimeFormat(
															'en',
															formField.dateFormat ?? {}
														).format(new Date(value));
													}
													returnValue = <>{dateTime}</>;
													break;
											}
											break;
										case 'number':
											switch ((formFields[column] as NumberField).format) {
												case 'currency':
													returnValue = Intl.NumberFormat('en', {
														style: 'currency',
														currency:
															row[
																(formFields[column] as NumberField)
																	.currencyField ?? 'USD'
															],
													}).format(value);
													break;
											}
											break;

										default:
											returnValue = <>{value}</>;
									}

									return <TableCell key={column}>{returnValue}</TableCell>;
								})}
								{actions && (
									<TableCell
										$align="center"
										$style={{
											width: '12px',
											position: 'sticky',
											right: 0,
											backgroundColor: $theme.colors.backgroundSecondary,
											border: '1px solid #ddd',
										}}
									>
										<StatefulPopover
											content={({ close }) => (
												<StatefulMenu
													items={
														actions?.map((res) => ({ label: res.label })) || []
													}
													onItemSelect={({ item }) => {
														onAction?.([row.id], item.itemId);
														close();
													}}
												/>
											)}
											placement="bottomLeft"
										>
											<Button size={SIZE.mini} kind={KIND.secondary}>
												<OverflowMenuVertical />
											</Button>
										</StatefulPopover>
									</TableCell>
								)}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</DataTableWrapper>
	);
}
