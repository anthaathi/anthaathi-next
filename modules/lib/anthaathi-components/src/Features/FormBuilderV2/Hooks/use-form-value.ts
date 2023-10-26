import { SetStateAction, useCallback, useContext, useMemo } from 'react';
import { FormBuilderContext } from '../Context/FormBuilderState';
import type { Operation } from 'fast-json-patch';
import jsonpath from 'fast-json-patch';

export function useFormValue<T = any>(path: string): [T, (value: SetStateAction<T>) => void] {
	const [state, setState] = useContext(FormBuilderContext);

	const value = useMemo(() => {
		return jsonpath.getValueByPointer(state, path);
	}, [path, state]);

	const updateValue = useCallback(
		(
			updateValue: any,
			op: 'replace' | 'add' | 'remove' = 'replace',
			localPath = path
		) => {
			return setState((prev) => {
				let value = updateValue;

				if (typeof updateValue === 'function') {
					value = updateValue(
						structuredClone(jsonpath.getValueByPointer(prev, path))
					);
				}

				const operation: Operation = {
					op,
					path: localPath,
					value: value,
				};

				return {
					...jsonpath.applyOperation(structuredClone(prev), operation).newDocument,
				};
			});
		},
		[path, setState]
	);

	return [value, updateValue];
}
