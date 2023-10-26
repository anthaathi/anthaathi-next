import { JSONBoolean, JSONSchema } from '../../type';
import { useFormValue } from '../../Hooks/use-form-value';
import { Cell } from 'baseui/layout-grid';
import { FormControl } from 'baseui/form-control';
import { useId } from 'react';
import { Checkbox } from 'baseui/checkbox';
import { Block } from 'baseui/block';

export interface RenderBooleanProps {
	field: JSONBoolean;
	rootSchema: JSONSchema;
	required?: boolean;
	path: string;
}

export function RenderBoolean(props: RenderBooleanProps) {
	const [value, setValue] = useFormValue(props.path);
	const id = useId();

	return (
		<Cell {...(props.field.cellProps ?? { span: 12 })}>
			<Block paddingTop="scale400" />
			<FormControl htmlFor={id}>
				<Checkbox
					overrides={{
						Input: {
							props: {
								id,
							},
						},
					}}
					required={props.required}
					checkmarkType={props.field.format === 'switch' ? 'toggle' : 'default'}
					checked={value}
					onChange={(e) => {
						setValue(e.target.checked);
					}}
				>
					{props.field.title}
				</Checkbox>
			</FormControl>
		</Cell>
	);
}
