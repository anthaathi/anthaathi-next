import { DataSource, StaticEnum } from '../DataSource';
import { useCallback, useEffect, useState } from 'react';
import { useDataSource } from '../../Datasource';
import {useFormValue} from "./use-form-value";

export function useDatasourceValues(
	dataSource?: DataSource,
): [
	values: StaticEnum[],
	isLoading: boolean,
	refetch: (currentInputState, currentValue) => Promise<void>
] {
	const [values, setValues] = useState([]);

	const [isLoading, setIsLoading] = useState(false);

	const { fetchData } = useDataSource();

	const [formValue] = useFormValue('/');

	const fetchNewData = useCallback(
		(value) => {
			if (dataSource?.type !== 'dynamic') {
				return Promise.resolve();
			}

			setIsLoading(true);

			return (
				fetchData?.(dataSource.name, value, formValue)
					?.then((data) => {
						setValues(data);
						setIsLoading(false);
					})
					.catch(() => {
						setIsLoading(false);
					}) ?? Promise.resolve()
			);
		},
		// @ts-ignore-next-line
		[dataSource?.name, dataSource?.type, fetchData, formValue]
	);

	useEffect(() => {
		fetchNewData(null);
		// @ts-ignore-next-line
	}, [dataSource?.name, dataSource?.type, fetchData, fetchNewData]);

	if (!dataSource) {
		return [[], false, () => Promise.resolve()];
	}

	if (dataSource.type === 'static') {
		return [
			dataSource.values,
			false,
			() => Promise.resolve(),
		];
	}

	return [values, isLoading, fetchNewData];
}
