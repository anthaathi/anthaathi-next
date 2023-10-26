import { JSONArray, JSONNumber, JSONSchema } from '../../type';
import { Cell } from 'baseui/layout-grid';
import { FormControl } from 'baseui/form-control';
import { Input } from 'baseui/input';
import React, { useContext, useId } from 'react';
import { Slider } from 'baseui/slider';
import { useFormValue } from '../../Hooks/use-form-value';
import { FormSizeContext } from '../../Context/FormSize';

export interface RenderNumberProps {
	rootSchema: JSONSchema;
	field: JSONNumber | JSONArray;
	required?: boolean;
	path: string;
}

export function RenderNumber(props: RenderNumberProps) {
	const id = useId();
	const [value, setValue] = useFormValue(props.path);
	const isArrayField = props.field.type === 'array';
	const size = useContext(FormSizeContext);

	switch (props.field.format) {
		case 'range':
			return (
				<Cell {...(props.field.cellProps ?? { span: 12 })}>
					<FormControl label={props.field.title} htmlFor={id}>
						<Slider
							value={isArrayField ? value ?? [0, 100] : [value]}
							onChange={(e) => {
								return isArrayField
									? setValue(e.value)
									: setValue(e.value?.[0]);
							}}
							overrides={{
								InnerTrack: {
									props: {
										id: id,
									},
								},
							}}
							max={props.field.maximum}
							min={props.field.minimum}
							step={props.field.step}
						/>
					</FormControl>
				</Cell>
			);

		case 'input':
		default:
			return (
				<Cell {...(props.field.cellProps ?? { span: 12 })}>
					<FormControl label={props.field.title}>
						<Input
							size={size}
							id={id}
							placeholder={props.field.title}
							type="number"
							onChange={(e) => {
								if (!isNaN(+e.target.value)) {
									setValue(e.target.value);
								}
								e.preventDefault();
							}}
							value={value}
							max={props.field.maximum}
							min={props.field.minimum}
							step={props.field.step}
						/>
					</FormControl>
				</Cell>
			);
	}
}
