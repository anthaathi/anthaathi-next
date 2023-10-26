import { DataTableToolbar } from '../DataTableToolbar';
import React, { useEffect, useState } from 'react';
import { DataTableViewTable } from '../DataTableViewTable';
import {
	DataTableView,
	DataTableViewContext,
} from '../../Context/DataTableView';
import { DataTableStateContext } from '../../Context/DataTableStateContext';
import { DataTableCardView } from '../../Views/DataTableCardView';
import {
	DataTablePagination,
	DataTablePaginationProps,
} from '../DataTablePagination';
import {
	DataTableAction,
	DataTableActionMethod,
	DatatableState,
	DataTableTheme,
} from '../../type';
import { JSONObject } from '../../../FormBuilderV2/type';

export interface DataTableProps<T> {
	actionButton?: React.ReactNode;
	onClick?: (item: T, columnId?: string) => void;
	data: T[];
	pagination?: DataTablePaginationProps;
	defaultIcon?: React.ReactElement;
	theme?: DataTableTheme;
	schema?: JSONObject;
	initialViewState?: DataTableView;
	onAction?: DataTableActionMethod<T>;
	actions?: DataTableAction[];
	onStateChange?: (state: Partial<DatatableState>) => void;
	initialState?: Partial<DatatableState>;
	onTableAction?: (input: string | string[]) => void;
}

export function DataTable<
	T extends { title: string; icon?: React.ReactElement; id: React.Key },
>(props: DataTableProps<T>) {
	const viewState = useState<DataTableView>(props.initialViewState ?? 'card');
	const tableState = useState<Partial<DatatableState>>({
		columnFilters: {},
		...(props.initialState ?? {}),
	});

	useEffect(() => {
		if (props.onStateChange) {
			props.onStateChange?.(tableState[0]);
		}

		// eslint-disable-next-line
	}, [tableState]);

	return (
		<DataTableStateContext.Provider value={tableState}>
			<DataTableViewContext.Provider value={viewState}>
				<DataTableToolbar
					onTableAction={props.onTableAction}
					theme={props.theme}
					schema={props.schema}
					actionButton={props.actionButton}
				/>
				{viewState[0] === 'table' && props.schema && (
					<DataTableViewTable<T>
						data={props.data}
						onAction={props.onAction}
						schema={props.schema}
						actions={props.actions}
					/>
				)}
				{viewState[0] === 'card' && (
					<DataTableCardView<T>
						actions={props.actions}
						onAction={props.onAction}
						defaultIcon={props.defaultIcon}
						onItemClick={props.onClick}
						data={props.data}
					/>
				)}
				{props.pagination && <DataTablePagination {...props.pagination} />}
			</DataTableViewContext.Provider>
		</DataTableStateContext.Provider>
	);
}
