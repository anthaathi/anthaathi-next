import {
	JSONArray,
	JSONBoolean,
	JSONNot,
	JSONNumber,
	JSONObject,
	JSONSchema,
	JSONString,
} from './type';

export function getDefaultObject(
	jsonSchema: JSONSchema,
	rootJSONSchema: JSONSchema,
	newValue?: any
) {
	if (jsonSchema === null) {
		return null;
	}

	rootJSONSchema = rootJSONSchema ?? jsonSchema;

	if (typeof jsonSchema === 'object' && '$ref' in jsonSchema) {
		if (
			'$defs' in rootJSONSchema &&
			rootJSONSchema.$defs?.[jsonSchema.$ref.replace('#/definitions/', '')]
		) {
			return getDefaultObject(
				rootJSONSchema.$defs?.[jsonSchema.$ref.replace('#/definitions/', '')],
				rootJSONSchema,
				newValue
			);
		}

		throw new Error(
			`Unable to find $ref - ${jsonSchema.$ref.replace(
				'#/definitions/',
				''
			)} in ${Object.keys((rootJSONSchema as JSONObject).$defs ?? {}).join(
				', '
			)}`
		);
	} else if ((jsonSchema as JSONObject).type === 'object') {
		const defaultObject: Record<string, any> = {};

		for (const [key, value] of Object.entries(
			(jsonSchema as JSONObject).properties ?? {}
		)) {
			if ((value as JSONString).default !== undefined) {
				defaultObject[key] = (value as JSONString).default;
			} else {
				defaultObject[key] = getDefaultObject(
					value!,
					rootJSONSchema,
					newValue?.[key]
				);
			}

			if (newValue?.[key] && (value as JSONArray).type !== 'array') {
				defaultObject[key] = newValue[key];
			}
		}
		return defaultObject;
	} else if (typeof jsonSchema === 'object' && 'const' in jsonSchema) {
		return jsonSchema.const;
	} else if (typeof jsonSchema === 'object' && 'oneOf' in jsonSchema) {
		const defaultObject = {};
		jsonSchema.oneOf.forEach((subSchema) => {
			Object.assign(
				defaultObject,
				getDefaultObject(subSchema, rootJSONSchema, newValue)
			);
		});
		return defaultObject;
	} else if (typeof jsonSchema === 'object' &&'anyOf' in jsonSchema) {
		const defaultObject = {};
		jsonSchema.anyOf.forEach((subSchema) => {
			Object.assign(
				defaultObject,
				getDefaultObject(subSchema, rootJSONSchema, newValue)
			);
		});
		return defaultObject;
	} else if (typeof jsonSchema === 'object' && 'allOf' in jsonSchema) {
		const defaultObject = {};
		jsonSchema.allOf.forEach((subSchema) => {
			Object.assign(
				defaultObject,
				getDefaultObject(subSchema, rootJSONSchema, newValue)
			);
		});
		return defaultObject;
	} else if (
		(jsonSchema as JSONArray).type === 'array' &&
		(jsonSchema as JSONArray).items
	) {
		if ((jsonSchema as JSONArray).format === 'range') {
			return (
				(jsonSchema as JSONArray).default ?? [
					(jsonSchema as JSONArray).minimum ?? 0,
					(jsonSchema as JSONArray).maximum ?? 100,
				]
			);
		}

		const isNewValue = Array.isArray(newValue) ? newValue : [];

		return (isNewValue ?? (jsonSchema as JSONArray).default ?? []).map((res) =>
			getDefaultObject((jsonSchema as JSONArray).items, rootJSONSchema, res)
		);
	} else if (typeof jsonSchema === 'object' && 'type' in jsonSchema && jsonSchema.type === 'string') {
		if (jsonSchema.default) {
			return jsonSchema.default;
		}

		switch (jsonSchema.format) {
			case 'date':
				return null;
		}

		return '';
	} else if ((jsonSchema as JSONBoolean).type === 'boolean') {
		return (jsonSchema as JSONBoolean).default ?? false;
	} else if ((jsonSchema as JSONNumber).type === 'number') {
		return (
			(jsonSchema as JSONNumber).default ?? (jsonSchema as JSONNumber).minimum
		);
	}

	// support for not
	if ((jsonSchema as JSONNot).not) {
		const notObject = getDefaultObject(
			(jsonSchema as JSONNot).not,
			rootJSONSchema,
			newValue
		);
		return !notObject;
	}

	// @ts-ignore
	return jsonSchema.default;
}
