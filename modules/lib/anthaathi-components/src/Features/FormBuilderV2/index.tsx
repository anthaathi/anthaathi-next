import { FileUploadType, JSONArray, JSONSchema } from './type';
import { RenderObject } from './Render/RenderObject';
import { Grid } from 'baseui/layout-grid';
import { FormBuilderContext } from './Context/FormBuilderState';
import { useEffect, useMemo, useState } from 'react';
import { getDefaultObject } from './getDefaultObject';
import { FormSizeContext } from './Context/FormSize';

export interface FormBuilderV2Props<T> {
	schema: JSONSchema;
	onFileUpload?: FileUploadType;
	onSubmit?: (input: T) => void;
	size?: 'compact' | 'mini' | 'default' | 'large';
	onChange?: (input: T) => void;
	initialValue?: Partial<T>;
	isLoading?: boolean;
}

export function FormBuilderV2<T = any>({
	onChange,
	initialValue,
	...props
}: FormBuilderV2Props<T>) {
	const initialState = useMemo(() => {
		return getDefaultObject(props.schema, props.schema, initialValue);
	}, [initialValue, props.schema]);

	const state = useState(initialState);

	const [value] = state;

	useEffect(() => {
		onChange?.(value);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value]);

	useEffect(() => {
		if ((props.schema as JSONArray).type === 'array') {
			console.warn("This behaviour is buggy. When the you use type: 'array'");
		}
	}, [props.schema]);

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				props.onSubmit?.(value);
			}}
		>
			<FormSizeContext.Provider value={props.size ?? 'default'}>
				<Grid gridMargins={0} gridMaxWidth={0}>
					<FormBuilderContext.Provider value={state}>
						<RenderObject
							isLoading={props.isLoading ?? false}
							onFileUpload={props.onFileUpload}
							rootSchema={props.schema}
							field={props.schema}
						/>
					</FormBuilderContext.Provider>
				</Grid>
			</FormSizeContext.Provider>
		</form>
	);
}
