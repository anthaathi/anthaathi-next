import { useMemo } from 'react';
import { FormData, FormSchema } from '../../FormBuilder/types';

export function useInitialValue(schema: FormSchema, defaultValue?: FormData) {
	return useMemo(() => {
		const initialValues: FormData = {};
		Object.entries(schema.properties).forEach(([key, field]) => {
			if (field.type === 'string') {
				initialValues[key] = field.defaultValue || '';
			} else if (field.type === 'integer' || field.type === 'number') {
				initialValues[key] = field.defaultValue || 0;
			} else {
				initialValues[key] = field.defaultValue;
			}
		});
		return Object.assign({}, initialValues, defaultValue);
	}, [defaultValue, schema.properties]);
}
