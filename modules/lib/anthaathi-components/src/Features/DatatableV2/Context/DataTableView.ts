import React, { Dispatch, SetStateAction, useContext } from 'react';

export type DataTableView = 'card' | 'table';

export const DataTableViewContext = React.createContext<
	[DataTableView, Dispatch<SetStateAction<DataTableView>>]
>(null as never);

export const useDataTableView = () => useContext(DataTableViewContext);
