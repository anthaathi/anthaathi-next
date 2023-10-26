import * as React from 'react';
import {
	MouseEventHandler,
	SetStateAction,
	useCallback,
	useContext,
	useMemo,
	useRef,
	useState,
} from 'react';
import { JSONObject, JSONString } from '../../../FormBuilderV2/type';
import { styled, useStyletron } from 'baseui';
import { expandBorderStyles } from 'baseui/styles';
import { Block } from 'baseui/block';
import { Button } from 'baseui/button';
import { Filter, Hide } from 'baseui/icon';
import { Search, SortAscending, SortDescending } from '@carbon/icons-react';
import { Input } from 'baseui/input';
import { FormattedMessage, useIntl } from 'react-intl';
import { FixedSizeList } from 'react-window';
import { Accordion, Panel } from 'baseui/accordion';
import { Select } from 'baseui/select';
import {
	DataTableAction,
	DataTableActionMethod,
	DatatableState,
} from '../../type';
import { DataTableOverflowAction } from '../DataTableOverflowAction';
import { Badge, HIERARCHY } from 'baseui/badge';
import { StaticEnum } from '../../../FormBuilderV2/DataSource';
import { Checkbox } from 'baseui/checkbox';
import { StyledLink } from 'baseui/link';
import {
	DataTableStateContext,
	useDataTableState,
} from '../../Context/DataTableStateContext';

// eslint-disable-next-line
export interface DataTableViewTableProps<T> {
	schema: JSONObject;
	onAction?: DataTableActionMethod<T>;
	data: T[];
	onSort?: (columnId: string, direction: 'asc' | 'desc') => void;
	actions?: DataTableAction[];
}

export function DataTableViewTable<
	T extends { title: string; icon?: React.ReactElement; id: React.Key },
>(props: DataTableViewTableProps<T>) {
	const [css, $theme] = useStyletron();

	const [state, setTableState] = useDataTableState();

	const [indexStatus, setIndexStatus] = useState(
		state.columnOrder ?? Object.keys(props.schema.properties),
	);

	const rows = useMemo(() => {
		return Object.entries(props.schema.properties)
			.map(([key, res], index) => {
				if (!res) {
					return null;
				}

				if ('type' in res) {
					switch (res.type) {
						case 'string':
						case 'number':
						case 'boolean':
							return {
								...res,
								key,
								index: index,
							};

						case 'array':
							if (
								res.items &&
								'type' in res.items &&
								res.items.type === 'object' &&
								res.items.properties.label
							) {
								return {
									...res,
									key,
									index: index,
								};
							}
					}
				}

				return null;
			})
			.filter(Boolean)
			.filter((res) => (state?.columnVisibility?.[res?.key] ?? true) !== false)
			.sort((v1, v2) => {
				const v2Index = indexStatus.findIndex((r) => r === v1.key);
				const v1Index = indexStatus.findIndex((r) => r === v2.key);

				return v2Index - v1Index;
			});
	}, [indexStatus, props.schema.properties, state?.columnVisibility]);

	const [focusedHeader, setFocusedHeader] = React.useState<string>();

	const parentRef = useRef<HTMLDivElement>(null);

	const [xy, setSortData] = React.useState<
		| {
				x: number;
				y: number;
				currentKey: string;
				maxWidth: number;
		  }
		| undefined
	>();

	const onTableHeaderClick: MouseEventHandler<HTMLTableCellElement> =
		useCallback((e) => {
			const parentRect = parentRef.current?.getBoundingClientRect()!;
			const parentOffsetTop = parentRect.top + window.scrollY;
			const parentOffsetLeft = parentRect.left + window.scrollX;

			const rect = (e.target as HTMLDivElement)
				.closest('th')
				?.getBoundingClientRect()!;

			const clientX = rect.left;
			const clientY = rect.bottom;

			const x = clientX - parentOffsetLeft;
			const y = clientY - parentOffsetTop;

			setSortData({
				x,
				y,
				currentKey: e.currentTarget.dataset.key!,
				maxWidth: rect.width,
			});

			setTimeout(() => {}, 0);
		}, []);

	const dataProcessed = useMemo(() => {
		return props.data
			.map((res) => {
				const returnObject: T = {
					...res,
				};

				if (typeof res !== 'object') {
					return null;
				}

				Object.entries(returnObject).forEach(([key, value]) => {
					const row = rows.find((res) => res?.key === key);

					if (!row) {
						return null;
					}

					if (
						row.type === 'array' &&
						row.items &&
						'type' in row.items &&
						row.items.type === 'object' &&
						row.items.properties.label &&
						Array.isArray(value)
					) {
						returnObject[key] = value
							.filter((res) => typeof res === 'object' && res && 'label' in res)
							.map((res, index) => (
								<Badge
									key={(res as { label: string }).label + index}
									content={(res as { label: string }).label}
									hierarchy={HIERARCHY.secondary}
									overrides={{
										Badge: {
											style: {
												marginRight: $theme.sizing.scale100,
												height: 'auto',
											},
										},
									}}
								/>
							));
					} else if (row.type === 'string' && row.format === 'file') {
						returnObject[key] = (
							<>
								{Array.isArray(value) && value.length !== 0 && (
									<div
										className={css({
											display: 'flex',
											alignItems: 'center',
											placeContent: 'center',
										})}
									>
										{/* @ts-ignore */}
										<StyledLink href={value?.[0]?.url} download>
											<FormattedMessage defaultMessage="View file" />
										</StyledLink>
									</div>
								)}
							</>
						);
					} else {
						returnObject[key] = value;
					}
				});

				return returnObject;
			})
			.filter(Boolean);
	}, [$theme.sizing.scale100, css, props.data, rows]);

	const [activeColumn, setActiveColumn] = useState<string | null>(null);
	const [hover, setHover] = useState<string | null>();

	return (
		<Block padding="scale200" position="relative" ref={parentRef}>
			{xy && (
				<>
					<div
						className={css({
							position: 'absolute',
							backgroundColor: $theme.colors.backgroundPrimary,
							borderBottomLeftRadius: $theme.borders.radius200,
							borderBottomRightRadius: $theme.borders.radius200,
							paddingLeft: $theme.sizing.scale400,
							paddingRight: $theme.sizing.scale400,
							top: xy.y + 'px',
							left: xy.x + 'px',
							...$theme.typography.LabelSmall,
							width: `calc(${xy.maxWidth + 'px'} - ${
								$theme.sizing.scale400
							} - ${$theme.sizing.scale400})`,
							maxWidth: '320px',
							minWidth: '260px',
							zIndex: 2,
							boxShadow: $theme.lighting.shadow600,
						})}
					>
						<SortDataDialog
							schema={props.schema}
							onCloseSort={() => {
								setSortData(undefined);
							}}
							currentKey={xy.currentKey}
							onSort={props.onSort}
						/>
					</div>
					<div
						onClick={() => {
							setSortData(undefined);
						}}
						className={css({
							zIndex: 1,
							position: 'absolute',
							top: '0',
							left: '0',
							right: '0',
							bottom: '0',
						})}
					/>
				</>
			)}

			<Block overflow="auto">
				<Table>
					<THead>
						<Tr>
							{rows.map((row, currentIndex) => {
								const width = state?.columnSizing?.[row.key];

								return (
									<Th
										key={row?.key}
										onClick={(props) => onTableHeaderClick(props)}
										data-key={row?.key}
										onMouseEnter={() => {
											setFocusedHeader(row?.key);
										}}
										onMouseLeave={() => {
											setFocusedHeader(undefined);
										}}
										onDragStart={(event) => {
											setActiveColumn(row?.key);
										}}
										onDragEnd={(event) => {
											setHover(null);
										}}
										onDragOver={(ev) => {
											ev.preventDefault();
											ev.dataTransfer.dropEffect = 'move';
											setHover(row?.key);
										}}
										onDrop={(ev) => {
											ev.preventDefault();

											const indexToMove = rows.findIndex(
												(row) => row?.key === activeColumn,
											);

											if (indexToMove === -1) {
												return;
											}

											setIndexStatus((state) => {
												const newState = [...state];

												const firstItem = newState.splice(indexToMove, 1)[0];
												newState.splice(currentIndex, 0, firstItem);

												setTableState((prev) => ({
													...prev,
													columnOrder: newState,
												}));

												return newState;
											});
										}}
										data-index={currentIndex}
										draggable
										$style={{
											width: width
												? typeof width === 'number'
													? width + 'px'
													: width
												: 'inherit',
											position: 'relative',
											'::before':
												row?.key === hover
													? {
															content: "''",
															position: 'absolute',
															left: 0,
															top: 0,
															bottom: 0,
															width: '4px',
															backgroundColor: $theme.colors.borderAccent,
													  }
													: {},
										}}
									>
										<Block
											$style={{
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'space-between',
												position: 'relative',
												minHeight: '24px',
											}}
										>
											<span
												className={css({
													display: 'flex',
													alignItems: 'center',
													justifyContent:
														(props.schema.properties?.[row.key] as JSONString)
															.align ?? 'flex-start',
													flexGrow: 1,
												})}
											>
												{row.title}
											</span>

											<span
												className={css({
													opacity:
														focusedHeader === row.key ||
														xy?.currentKey === row.key
															? 1
															: 0,
													position: 'absolute',
													right: '0',
													transitionDuration: $theme.animation.timing100,
													transitionProperty: 'opacity',
													transitionTimingFunction:
														$theme.animation.easeInOutCurve,
													':hover': {
														opacity: 1,
													},
												})}
											>
												<Button size="mini" kind="secondary">
													<Filter />
												</Button>
											</span>
										</Block>
									</Th>
								);
							})}
							{(props.actions ?? []).length !== 0 && (
								<Th style={{ width: '38px' }}>
									<FormattedMessage defaultMessage="Actions" />
								</Th>
							)}
						</Tr>
					</THead>
					<TBody>
						{dataProcessed.map((res) => (
							<React.Fragment key={res.id}>
								<Tr>
									{rows.map((row, index) => {
										return (
											<Td key={row.key + index}>
												<div
													className={css({
														display: 'flex',
														flexWrap: 'wrap',
														alignItems: 'center',
														justifyContent:
															(props.schema.properties?.[row.key] as JSONString)
																?.align ?? 'flex-start',
													})}
												>
													{res[row.key]}
												</div>
											</Td>
										);
									})}
									{(props.actions ?? []).length !== 0 && (
										<Td>
											<div
												className={css({
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
												})}
											>
												<DataTableOverflowAction<T>
													actions={props.actions}
													row={res}
													onAction={props.onAction}
												/>
											</div>
										</Td>
									)}
								</Tr>
							</React.Fragment>
						))}
					</TBody>
				</Table>
			</Block>
		</Block>
	);
}

interface SortDataDialogProps {
	onSort?: (key: string, direction: 'asc' | 'desc') => void;
	currentKey: string;
	onCloseSort?: () => void;
	schema: JSONObject;
}

const SortDataDialog = (props: SortDataDialogProps) => {
	const [css, $theme] = useStyletron();
	const intl = useIntl();
	const data = props.schema.properties[props.currentKey];
	const [state, setState] = useContext(DataTableStateContext);

	const values: StaticEnum[] = useMemo(() => {
		if (!data) {
			return [];
		}

		if (!('type' in data)) {
			return [];
		}

		if (!('dataSource' in data)) {
			return [];
		}

		return (
			(data.dataSource?.type === 'static' ? data.dataSource.values : []) ?? []
		);
	}, [data])!;

	return (
		<>
			<div
				className={css({
					display: 'flex',
					alignItems: 'center',
					paddingTop: $theme.sizing.scale200,
					paddingBottom: $theme.sizing.scale200,
					borderBottomStyle: $theme.borders.border100.borderStyle,
					borderBottomWidth: $theme.borders.border100.borderWidth,
					borderBottomColor: $theme.borders.border100.borderColor,
				})}
			>
				<Button
					size="mini"
					kind="secondary"
					onClick={() => {
						props.onSort?.(props.currentKey, 'asc');
						props.onCloseSort?.();
					}}
				>
					<SortAscending />
				</Button>
				<span
					className={css({
						marginLeft: $theme.sizing.scale200,
					})}
				/>
				<Button
					size="mini"
					kind="secondary"
					onClick={() => {
						props.onSort?.(props.currentKey, 'desc');
						props.onCloseSort?.();
					}}
				>
					<SortDescending />
				</Button>
				<span
					className={css({
						marginLeft: $theme.sizing.scale200,
					})}
				/>
				<Button
					size="mini"
					kind="secondary"
					onClick={() => {
						setState?.((prev) => {
							const setValue =
								prev.columnVisibility?.[props.currentKey] !== undefined
									? !(prev.columnVisibility?.[props.currentKey] ?? true) ||
									  !(prev.columnVisibility ?? true)?.[props.currentKey]
									: false;

							return {
								...state,
								columnVisibility: {
									...(prev.columnVisibility ?? {}),
									[props.currentKey]: setValue,
								},
							};
						});

						props.onCloseSort?.();
					}}
				>
					<Hide />
				</Button>
			</div>

			<Accordion
				onChange={({ expanded }) => console.log(expanded)}
				accordion
				initialState={{
					expanded:
						values && values.length === 0
							? ['filter-by-condition']
							: ['filter-by-value'],
				}}
			>
				<Panel
					key="filter-by-condition"
					overrides={styleData}
					title={intl.formatMessage({ defaultMessage: 'Filter by condition' })}
				>
					<FilterDataByCondition />
				</Panel>
				{values && values.length !== 0 && (
					<Panel
						key="filter-by-value"
						overrides={styleData}
						title={intl.formatMessage({ defaultMessage: 'Filter by values' })}
					>
						<FilterDataByValues
							values={values}
							appState={state}
							currentKey={props.currentKey}
						/>
					</Panel>
				)}
			</Accordion>
		</>
	);
};

export interface FilterDataByConditionProps {}

const FilterDataByCondition = (props: FilterDataByConditionProps) => {
	const [css, $theme] = useStyletron();
	const intl = useIntl();

	const conditions = useMemo(() => {
		return [
			{
				key: 'none',
				label: intl.formatMessage({ defaultMessage: 'None' }),
			},
			{
				divider: true,
			},
			{
				key: 'is-empty',
				label: intl.formatMessage({ defaultMessage: 'Is empty' }),
			},
			{
				key: 'is-not-empty',
				label: intl.formatMessage({ defaultMessage: 'Is not empty' }),
			},
			{
				divider: true,
			},
			{
				key: 'text-contains',
				label: intl.formatMessage({ defaultMessage: 'Text contains' }),
			},
			{
				key: 'text-does-not-contain',
				label: intl.formatMessage({ defaultMessage: 'Text does not contain' }),
			},
			{
				key: 'text-starts-with',
				label: intl.formatMessage({ defaultMessage: 'Text starts with' }),
			},
			{
				key: 'text-ends-with',
				label: intl.formatMessage({ defaultMessage: 'Text ends with' }),
			},
			{
				key: 'text-is-exact',
				label: intl.formatMessage({ defaultMessage: 'Text is exact' }),
			},
		];
	}, [intl]);

	return (
		<div
			className={css({
				display: 'flex',
				marginTop: $theme.sizing.scale300,
				marginBottom: $theme.sizing.scale300,
			})}
		>
			<Select size="compact" options={conditions} />
		</div>
	);
};

const styleData = {
	Content: {
		style: {
			paddingLeft: '6px',
			paddingRight: '6px',
			paddingTop: 0,
			paddingBottom: 0,
		},
	},
	Header: {
		style: {
			fontSize: '14px',
			paddingLeft: '10px',
			paddingRight: '10px',
			paddingBottom: '8px',
			paddingTop: '8px',
		},
	},
};

function FilterDataByValues(props: {
	values: StaticEnum[];
	appState?: Partial<DatatableState>;
	currentKey: string;
}) {
	const [css, $theme] = useStyletron();
	const intl = useIntl();

	const state = useMemo(() => {
		return (
			props.appState?.columnFilters?.[props.currentKey]?.value?.selectedIds ??
			[]
		);
	}, [props.appState?.columnFilters, props.currentKey]);

	const [, setAppState] = useContext(DataTableStateContext);

	const setState: React.Dispatch<SetStateAction<string[]>> = useCallback(
		(input) => {
			setAppState?.((prev) => {
				const func =
					typeof input === 'function'
						? input
						: () => {
								return input;
						  };

				return {
					...prev,
					columnFilters: {
						...(prev.columnFilters || {}),
						[props.currentKey]: {
							...(prev.columnFilters ?? {})[props.currentKey],
							value: {
								selectedIds: func(
									prev.columnFilters?.[props.currentKey]?.value?.selectedIds ??
										[],
								),
							},
						},
					},
				};
			});
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[setAppState],
	);

	const [searchState, setSearchState] = useState('');

	const searchedValues = useMemo(() => {
		return props.values.filter((res) =>
			res.label.toLowerCase().includes(searchState.toLowerCase()),
		);
	}, [props.values, searchState]);

	return (
		<>
			<div
				className={css({
					display: 'flex',
					marginTop: $theme.sizing.scale300,
					marginBottom: $theme.sizing.scale300,
				})}
			>
				<button
					className={css({
						textDecoration: 'underline',
						...$theme.typography.LabelSmall,
						color: $theme.colors.contentPrimary,
						backgroundColor: $theme.colors.backgroundPrimary,
						border: 'none',
						cursor: 'pointer',
					})}
					onClick={(e) => {
						setState(() => searchedValues.map((res) => res.id));
					}}
				>
					{intl.formatMessage({ defaultMessage: 'Select All' })}
				</button>

				<button
					className={css({
						textDecoration: 'underline',
						...$theme.typography.LabelSmall,
						color: $theme.colors.contentPrimary,
						backgroundColor: $theme.colors.backgroundPrimary,
						border: 'none',
						cursor: 'pointer',
					})}
					onClick={() => {
						setState([]);
					}}
				>
					{intl.formatMessage({ defaultMessage: 'Clear' })}
				</button>
			</div>

			<div
				className={css({
					display: 'flex',
					borderTopColor: $theme.borders.border100.borderColor,
					borderTopStyle: $theme.borders.border100.borderStyle,
					borderTopWidth: $theme.borders.border100.borderWidth,
					paddingTop: $theme.sizing.scale200,
					paddingBottom: $theme.sizing.scale200,
				})}
			>
				<Input
					startEnhancer={<Search />}
					value={searchState}
					onChange={(e) => setSearchState(e.target.value)}
					placeholder={intl.formatMessage({ defaultMessage: 'Filter' })}
					size="compact"
				/>
			</div>

			<div>
				<VirtualizedList
					listData={searchedValues}
					selectedIds={state}
					onSelect={(selectedIds, checked) => {
						setState((prev) => {
							if (!checked) {
								return prev.filter((res) => res !== selectedIds);
							}
							if (prev.indexOf(selectedIds) !== -1) {
								return prev;
							}
							return [...prev, selectedIds];
						});
					}}
				/>
			</div>
		</>
	);
}

function VirtualizedList<T extends StaticEnum>({
	listData,
	selectedIds,
	onSelect,
}: {
	listData: T[];
	selectedIds?: string[];
	onSelect?: (selectedIds: string, checked: boolean) => void;
}) {
	const [css, $theme] = useStyletron();

	const renderRow = ({ index, style }) => (
		<li
			style={style}
			className={css({
				cursor: 'pointer',
				display: 'flex',
				alignItems: 'center',
				transitionDuration: $theme.animation.timing100,
				transitionProperty: 'background-color',
				transitionTimingFunction: $theme.animation.easeInOutCurve,
				userSelect: 'none',
			})}
		>
			<div className={css({ width: '8px' })}></div>
			<Checkbox
				checked={selectedIds?.includes(listData[index].id)}
				onChange={(e) => {
					onSelect?.(listData[index].id, e.target.checked);
				}}
			>
				{listData[index].label}
			</Checkbox>
		</li>
	);

	return (
		// @ts-ignore
		<FixedSizeList
			innerElementType={(props) => (
				<ul
					className={css({
						listStyle: 'none',
						marginLeft: 0,
						paddingLeft: 0,
					})}
					{...props}
				/>
			)}
			height={Math.min(400, listData.length * 44)} // Specify the height of the list container
			itemCount={listData.length} // Total number of items in the list
			itemSize={44} // Specify the height of each item
			width="100%" // Specify the width of the list container
		>
			{renderRow}
		</FixedSizeList>
	);
}

export const Td = styled('td', ({ $theme }) => ({
	...$theme.typography.ParagraphSmall,
	borderBottomColor: $theme.borders.border100.borderColor,
	borderBottomStyle: $theme.borders.border100.borderStyle,
	borderBottomWidth: $theme.borders.border100.borderWidth,
	borderRightColor: $theme.borders.border100.borderColor,
	borderRightStyle: $theme.borders.border100.borderStyle,
	borderRightWidth: $theme.borders.border100.borderWidth,
	paddingTop: $theme.sizing.scale200,
	paddingBottom: $theme.sizing.scale200,
	textAlign: 'left',
	paddingLeft: $theme.sizing.scale400,
	paddingRight: $theme.sizing.scale400,
}));

export const Th = styled('th', ({ $theme }) => ({
	...$theme.typography.LabelSmall,
	minHeight: '40px',
	borderBottomColor: $theme.borders.border100.borderColor,
	borderBottomStyle: $theme.borders.border100.borderStyle,
	borderBottomWidth: $theme.borders.border100.borderWidth,
	borderRightColor: $theme.borders.border100.borderColor,
	borderRightStyle: $theme.borders.border100.borderStyle,
	borderRightWidth: $theme.borders.border100.borderWidth,
	paddingTop: $theme.sizing.scale200,
	paddingBottom: $theme.sizing.scale200,
	textAlign: 'left',
	backgroundColor: $theme.colors.backgroundSecondary,
	paddingLeft: $theme.sizing.scale400,
	paddingRight: $theme.sizing.scale400,
	cursor: 'pointer',
}));

export const Tr = styled('tr', () => ({}));

export const TBody = styled('tbody', () => ({}));

export const THead = styled('thead', () => ({}));

export const Table = styled('table', ({ $theme }) => ({
	width: '100%',
	borderCollapse: 'collapse',
	borderSpacing: 0,
	tableLayout: 'auto',
	borderRadius: $theme.borders.radius200,
	...expandBorderStyles($theme.borders.border100),
}));
