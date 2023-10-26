import { RenderObject, RenderObjectProps } from '../Render/RenderObject';
import {
	JSONConst,
	JSONObject,
	JSONOneOf,
	JSONSchema,
	JSONString,
} from '../type';
import { useMemo } from 'react';
import { DataSource, StaticEnum } from '../DataSource';
import { useFormValue } from '../Hooks/use-form-value';

function findCommonStrings(arr: string[][]): string[] {
	if (arr.length === 0) {
		return [];
	}

	// Use the first subarray as a starting point for the common strings
	let commonStrings = arr[0];

	// Iterate over the remaining subarrays and keep only the common strings
	for (let i = 1; i < arr.length; i++) {
		const subArray = arr[i];
		commonStrings = commonStrings.filter((str) => subArray.includes(str));
	}

	return commonStrings;
}

export function RenderOneOf(props: RenderObjectProps & { field: JSONOneOf }) {
	const [value] = useFormValue(props.path!);

	const allItems: JSONObject[] = props.field.oneOf
		.map((res) => {
			if (typeof res === 'object' && '$ref' in res) {
				const returnValue = (props.rootSchema as JSONObject).$defs?.[
					// @ts-ignore
					res.$ref.replace('#/definitions/', '')
				];

				if (!returnValue) {
					// @ts-ignore
					throw new Error(res.$ref + ' definition not found');
				}

				return returnValue as never;
			}
			return res as never;
		})
		.filter((res) => {
			return (res as JSONObject).type === 'object';
		});

	const commonProperties = useMemo(() => {
		const keys: string[][] = allItems.map((res) => {
			return Object.keys(res.properties ?? {});
		});

		const commonStrings = findCommonStrings(keys);

		const existingDataType: Record<string, string> = {};

		allItems.forEach((schema) => {
			commonStrings.forEach((property) => {
				const type = ((schema as JSONObject).properties[property] as JSONObject)
					.type;
				const constValue = (schema as JSONObject).properties[
					property
				] as JSONConst;

				if (
					((existingDataType[property] &&
						type !== existingDataType[property]) ||
						!type) &&
					!constValue
				) {
					console.warn('Data type is different for oneOf properties');
				}

				if (!existingDataType[property]) {
					existingDataType[property] = type;
				}
			});
		});

		return commonStrings;
	}, [allItems]);

	const commonPropertiesType: JSONSchema = useMemo(() => {
		const properties: Record<string, JSONSchema> = {};

		commonProperties.forEach((property) => {
			const dataSource: DataSource = {
				type: 'static',
				values: [],
			};

			allItems.forEach((renderField) => {
				properties[property] =
					properties[property] ??
					Object.assign({}, renderField.properties[property]);

				const current = renderField.properties[property];

				if (!current) {
					return;
				}

				if ('const' in current) {
					dataSource.values.push({
						id: current.const as string,
						label: current.title ?? (current.const as string),
					});
					return;
				}

				if (current && 'type' in current && current.type === 'string') {
					const currentDataSource = current.dataSource;

					if (
						currentDataSource &&
						'type' in currentDataSource &&
						currentDataSource.type === 'static'
					) {
						dataSource.values = [
							...dataSource.values,
							...currentDataSource.values,
						];
					} else {
						console.warn(
							`Datasource is required when using oneOf for ${property}`
						);
					}
				}
			});

			if ('const' in properties[property]) {
				// @ts-ignore
				delete properties[property].const;
				// @ts-ignore
				properties[property].dataSource = dataSource;
				// @ts-ignore
				properties[property].type = properties[property].type ?? 'string';
				// @ts-ignore
				properties[property].format = properties[property].format ?? 'select';
			}
		});

		return {
			type: 'object',
			title: 'Select',
			properties,
		};
	}, [commonProperties, allItems]);

	const selectedOption = useMemo(() => {
		const allValues: Record<string, StaticEnum[]> = {};

		allItems.forEach((res) => {
			commonProperties.forEach((prop) => {
				const currentPro = res.properties[prop];

				if (!currentPro) {
					return null;
				}

				if ('dataSource' in currentPro) {
					if (currentPro.dataSource?.type === 'static') {
						allValues[prop] = (allValues[prop] ?? []).concat(
							currentPro.dataSource.values ?? []
						);
					}
				}

				if ('const' in currentPro) {
					allValues[prop] = (allValues[prop] ?? []).concat([
						{
							id: currentPro.const as never,
							label: currentPro.title ?? (currentPro.const as never),
						},
					]);
				}
			});
		});

		const selectedValue = allItems.find((res) => {
			return commonProperties.find((prop) => {
				const currentPro = res.properties[prop];

				if (!currentPro) {
					return null;
				}

				if ('dataSource' in currentPro) {
					if (currentPro.dataSource?.type === 'static') {
						return currentPro.dataSource.values.find(
							(currentValue) => currentValue.id === value[prop]
						);
					}
				}

				if ('const' in currentPro) {
					return value?.[prop] === currentPro.const;
				}

				return false;
			});
		});

		if (!selectedValue) {
			return null;
		}

		const v = structuredClone(selectedValue);

		commonProperties.forEach((e) => {
			const property = v.properties[e];

			if (!property) {
				return null;
			}

			if ('dataSource' in property) {
				const newDataSource = structuredClone(property.dataSource);

				if (newDataSource?.type === 'static') {
					newDataSource.values = allValues[e];
				}

				property.dataSource = newDataSource;
			} else {
				// @ts-ignore
				property.dataSource = {
					type: 'static',
					values: allValues[e],
				} as DataSource;
			}

			(property as JSONString).type = 'string';
			(property as JSONString).format = 'select';

			if ('const' in (property as JSONConst)) {
				// @ts-ignore
				delete property.const;
			}

			v.properties[e] = property;
		});

		return v;
	}, [commonProperties, allItems, value]);

	if (selectedOption) {
		return (
			<RenderObject
				isLoading={props.isLoading}
				onFileUpload={props.onFileUpload}
				path={props.path ?? '/'}
				required={props.required}
				rootSchema={props.rootSchema}
				field={selectedOption}
			/>
		);
	}

	if (Object.keys(commonPropertiesType?.properties ?? {}).length === 0) {
		throw new Error('No support yet');
	}

	// First render components which are matching then render the whole object.

	return (
		<>
			<RenderObject
				isLoading={props.isLoading}
				onFileUpload={props.onFileUpload}
				path={props.path ?? '/'}
				required={props.required}
				rootSchema={props.rootSchema}
				field={commonPropertiesType}
			/>
		</>
	);
}
