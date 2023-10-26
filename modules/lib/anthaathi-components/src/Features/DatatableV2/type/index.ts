import { TableState } from '@tanstack/react-table';

export type { VisibilityState } from '@tanstack/react-table';

export enum DataTableTheme {
	Light = 'light',
	Dark = 'dark',
}

export interface DataTableAction {
	label: string;
	key: string;
}

export type DataTableActionMethod<T> = (items: T[], action: string) => void;

export type DatatableState = Omit<TableState, 'columnFilters'> & {
	columnFilters: {
		[columnId: string]: {
			condition: {
				condition: string;
				value: string;
			};
			value: {
				selectedIds: string[];
			};
		};
	};
};
