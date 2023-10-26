import React, {
	createContext,
	Dispatch,
	SetStateAction,
	useContext,
	useState,
} from 'react';
import { ComposedFilter } from '../filters';

export type ColumnOrderData = {
	index: number;
	width: number;
	visible: boolean;
};

export type ColumnConfig = Record<string, ColumnOrderData>;

export interface DataTableConfig {
	// Add the properties of your config object here
	columnConfig: ColumnConfig;
	filters: ComposedFilter;
	sort?: { column: string; direction: 'asc' | 'desc' };
	rowsPagePage: number;
	mode?: 'select' | 'view';
}

export interface ConfigContextValue {
	config: DataTableConfig;
	setConfig: Dispatch<SetStateAction<DataTableConfig>>;
}

const ConfigContext = createContext<ConfigContextValue>({} as never);

function ConfigProvider({
	children,
	initialConfig,
}: {
	children: React.ReactNode;
	initialConfig?: DataTableConfig;
}) {
	const [config, setConfig] = useState<DataTableConfig>(
		initialConfig ?? {
			columnConfig: {},
			filters: {
				$kind: 'and',
				and: [],
			},
			rowsPagePage: 50,
		}
	);

	return (
		<ConfigContext.Provider value={{ config, setConfig }}>
			{children}
		</ConfigContext.Provider>
	);
}

function useDatatableConfig(): ConfigContextValue {
	return useContext(ConfigContext);
}

export { ConfigProvider, useDatatableConfig };
