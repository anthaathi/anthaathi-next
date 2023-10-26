import React, { createContext, useCallback, useContext, useMemo } from 'react';

/**
 * Context to store the data sources
 */
export type DataSource<T extends object = any, U = any, W = any> = (
	values: T,
	currentInputState: W
) => Promise<U>;

export type GlobalSearchDataSource = DataSource<
	{ search: string; after?: string; before?: string; pageSize?: number },
	GlobalSearchDataSourceReturn
>;

export interface GlobalSearchDataSourceReturn {
	total: number;
	items: Array<{
		label: string;
		id: string;
		to?: string;
		onClick?: VoidFunction;
	}>;
}

export type GlobalUserDataSource = DataSource<{ query: string }, User[]>;

interface User {
	label: string;
	id: string;
	profilePicture?: string;
}

/**
 * Context to store the data sources
 */
export interface DataSources {
	search?: GlobalSearchDataSource;
	user?: GlobalUserDataSource;
	[key: string]: DataSource | undefined;
}

/**
 * Context to store the data sources
 */
interface DataSourceContextProps {
	dataSources: DataSources;
	children: React.ReactNode;
}

/**
 * Context to store the data sources
 */
const DataSourceContext = createContext<DataSources | undefined>(undefined);

/**
 * Provider to provide data sources to the form builder
 * @param dataSources
 * @param children
 * @constructor
 */
const DataSourceProvider: React.FC<DataSourceContextProps> = ({
	dataSources,
	children,
}) => {
	const prevDataSources = useContext(DataSourceContext);

	const allSources = useMemo(() => {
		return {
			...(prevDataSources ?? {}),
			...dataSources,
		};
	}, [prevDataSources, dataSources]);

	return (
		<DataSourceContext.Provider value={allSources}>
			{children}
		</DataSourceContext.Provider>
	);
};

DataSourceProvider.displayName = 'DataSourceProvider';

/**
 * Hook to get the data sources from the context
 */
const useDataSource = () => {
	const dataSources = useContext(DataSourceContext);

	if (dataSources == null) {
		throw new Error(
			'No data sources found in context. Make sure you have wrapped your component in a DataSourceProvider.'
		);
	}

	const fetchData = useCallback(
		(key: string, formValue?: object, currentInputState?: any) => {
			return dataSources?.[key]?.(formValue, currentInputState);
		},
		[dataSources]
	);

	return { fetchData, dataSources };
};

/**
 * Hook to get a data source from the context
 */
export { DataSourceProvider, useDataSource };
