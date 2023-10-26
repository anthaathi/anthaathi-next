import React, { SetStateAction } from 'react';
import { DataTableView } from './DataTableView';

export const DataTableViewContext = React.createContext<
	[DataTableView, React.Dispatch<SetStateAction<DataTableView>>]
>(null as never);
