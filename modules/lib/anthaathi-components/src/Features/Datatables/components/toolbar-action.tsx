import { styled, useStyletron } from 'baseui';
import { Item, MenuOverrides, StatefulMenu } from 'baseui/menu';
import { StatefulPopover } from 'baseui/popover';
import {
	CheckboxChecked,
	ChevronSortDown,
	Column,
	DataFormat,
	DataRefinery,
	DocumentDownload,
	Filter as FilterIcon,
	Save,
} from '@carbon/icons-react';
import { Button, KIND, SIZE } from 'baseui/button';
import React, { useCallback, useMemo, useState } from 'react';
import { Filter } from '../filters';
import { FormSchema } from '../../FormBuilder/types';
import {
	Modal,
	ModalBody,
	ModalButton,
	ModalFooter,
	ModalHeader,
	SIZE as ModalSize,
} from 'baseui/modal';
import { SplitColumnWidthAndDisplayOrder } from './split-column-width-and-display-order';
import { useDatatableConfig } from '../context/use-datatable-context';
import type { RefetchFunction } from '../index';

export interface ToolbarActionProps {
	refetch?: RefetchFunction;
	schema: FormSchema;
}

export const ToolbarAction = ({ schema, refetch }: ToolbarActionProps) => {
	const [css, $theme] = useStyletron();
	const { config, setConfig } = useDatatableConfig();

	const [isFilterOpen, setIsFilterOpen] = useState(false);

	const [isColumnOpen, setIsColumnOpen] = useState(false);

	const onItemSelect = useCallback(
		(item: Item, close?: () => void) => {
			switch (item.item.action || item.item.key) {
				case 'filter':
					setIsFilterOpen(true);
					break;
				case 'columns':
					setIsColumnOpen(true);
					break;
				case 'rows-per-page':
					setConfig((prev) => {
						const returnValue = {
							...prev,
							rowsPagePage: item.item.value,
						};
						return returnValue as never;
					});
					break;
				case 'row-selection':
					setConfig((prev) => {
						return {
							...prev,
							mode: prev.mode === 'select' ? 'view' : 'select',
						};
					});
					break;
				default:
					break;
			}
			return close?.();
		},
		[setConfig]
	);

	const defaultMenuOverrides: MenuOverrides = useMemo(
		() => ({
			Option: {
				props: {
					getChildMenu: (item: { children: Item[]; key: string }) => {
						if (!item.children) {
							return <React.Fragment key={item.key} />;
						}
						return (
							<StatefulMenu
								key={item.key}
								onItemSelect={(item) => onItemSelect(item)}
								items={item.children}
								overrides={defaultMenuOverrides}
							/>
						);
					},

					overrides: {
						ListItem: {
							style: {
								width: '240px',
								':hover': {
									backgroundColor: $theme.colors.backgroundTertiary,
								},
							},
						},
					},
				},
			},
		}),
		[$theme.colors.backgroundTertiary, onItemSelect]
	);

	return (
		<>
			<Modal
				isOpen={isFilterOpen}
				onClose={() => {
					refetch?.(config);
					setIsFilterOpen(false);
				}}
				size={ModalSize.auto}
			>
				<ModalHeader>Filters</ModalHeader>
				<ModalBody $style={{ width: '920px', maxWidth: '80vw' }}>
					{isFilterOpen && (
						<Filter
							filter={config.filters}
							onChange={(input) =>
								setConfig((config) => {
									return {
										...config,
										filters: input,
									};
								})
							}
							schema={schema}
							simpleUI={true}
						/>
					)}
				</ModalBody>
				<ModalFooter>
					<ModalButton
						onClick={() => {
							setIsFilterOpen(false);
						}}
					>
						Apply
					</ModalButton>
				</ModalFooter>
			</Modal>
			<Modal
				isOpen={isColumnOpen}
				size={ModalSize.auto}
				onClose={() => {
					refetch?.(config);
					setIsColumnOpen(false);
				}}
			>
				<ModalHeader>Edit Columns</ModalHeader>
				<div
					className={css({
						borderTopStyle: 'solid',
						borderTopWidth: '1px',
						borderTopColor: '#d9d9d9',
					})}
				/>
				<ModalBody
					$style={{
						width: '820px',
						maxWidth: '80vw',
						marginTop: 0,
						marginRight: 0,
						marginLeft: 0,
						marginBottom: 0,
					}}
				>
					{isColumnOpen && <SplitColumnWidthAndDisplayOrder schema={schema} />}
				</ModalBody>
				<div
					className={css({
						borderBottomStyle: 'solid',
						borderBottomWidth: '1px',
						borderBottomColor: '#d9d9d9',
					})}
				/>
				<ModalFooter>
					<ModalButton onClick={() => setIsColumnOpen(false)}>
						Close
					</ModalButton>
				</ModalFooter>
			</Modal>
			<StatefulPopover
				placement="bottomLeft"
				content={({ close }) => (
					<StatefulMenu
						items={[
							{
								label: (
									<MenuItem>
										<Column />
										<MenuItemSpan />
										Columns
									</MenuItem>
								),
								key: 'columns',
							},
							{ divider: true, key: 'divider' },
							{
								label: (
									<MenuItem>
										<FilterIcon />
										<MenuItemSpan />
										Filter
									</MenuItem>
								),
								key: 'filter',
							},
							{
								label: (
									<MenuItem>
										<DataRefinery />
										<MenuItemSpan />
										Data
									</MenuItem>
								),
								key: 'data',
								children: [
									{ label: 'Sort', key: 'sort', disabled: true },
									{ label: 'Aggregate', key: 'aggregate', disabled: true },
									{ label: 'Refresh', key: 'refresh' },
								],
							},
							{
								label: (
									<MenuItem>
										<DataFormat />
										<MenuItemSpan />
										Format
									</MenuItem>
								),
								key: 'format',
								children: [
									{
										label: 'Rows per page',
										children: [
											{ label: '10', key: '10', action: 'rows-per-page' },
											{ label: '25', key: '25', action: 'rows-per-page' },
											{ label: '50', key: '50', action: 'rows-per-page' },
											{ label: '100', key: '100', action: 'rows-per-page' },
										],
									},
								],
							},
							{
								label: (
									<MenuItem>
										<CheckboxChecked />
										<MenuItemSpan />
										Selection
									</MenuItem>
								),
								key: 'selection',
								children: [
									{
										label: 'Row selection',
										key: 'row-selection',
									},
								],
							},
							{ divider: true, key: 'divider-2' },
							{
								label: (
									<MenuItem>
										<DocumentDownload />
										<MenuItemSpan />
										Download
									</MenuItem>
								),
								key: 'download',
							},
							{
								label: (
									<MenuItem>
										<Save />
										<MenuItemSpan />
										Save Report
									</MenuItem>
								),
								icon: <Save />,
								key: 'save-report',
							},
						]}
						overrides={defaultMenuOverrides}
						onItemSelect={(item) => {
							onItemSelect(item, close);
						}}
					/>
				)}
			>
				<Button
					kind={KIND.secondary}
					size={SIZE.compact}
					endEnhancer={
						<ChevronSortDown
							className={css({ position: 'relative', top: '-4px' })}
						/>
					}
					overrides={{
						EndEnhancer: { style: { marginLeft: 0 } },
						Root: {
							style: {
								width: '100%',
							},
						},
					}}
				>
					Action
				</Button>
			</StatefulPopover>
		</>
	);
};

export const MenuItem = styled('div', {
	display: 'flex',
	alignItems: 'center',
});

export const MenuItemSpan = styled('span', {
	marginLeft: '8px',
	display: 'block',
});
