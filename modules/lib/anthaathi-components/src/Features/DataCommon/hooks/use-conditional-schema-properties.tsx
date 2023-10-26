import { FormData, FormField, FormSchema } from '../../FormBuilder/types';
import { useMemo } from 'react';
import jsonLogic from 'json-logic-js';

export type ConditionalSchemaPropertiesReturn = Record<string, FormField>;

export function useConditionalSchemaProperties(
	schema: FormSchema,
	data: FormData
): ConditionalSchemaPropertiesReturn {
	return useMemo(() => {
		const properties: Record<string, FormField> = {};
		Object.entries(schema.properties).forEach(([key, field]) => {
			if (
				(field.condition && !jsonLogic.apply(field.condition, data)) ||
				field.type === 'hidden'
			) {
				return;
			}
			properties[key] = field;
		});

		return properties;
	}, [schema.properties, data]);
}
