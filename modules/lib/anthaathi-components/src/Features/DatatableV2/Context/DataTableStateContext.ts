import React, { SetStateAction, useContext } from 'react';
import { DatatableState } from '../type';

export const DataTableStateContext = React.createContext<
	[
		Partial<DatatableState>,
		React.Dispatch<SetStateAction<Partial<DatatableState>>>
	]
>(null as never);

export const useDataTableState = () => useContext(DataTableStateContext);
