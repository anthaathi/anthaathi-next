import { FormControl } from 'baseui/form-control';
import { FormLabel } from './FormLabel';
import { COUNTRIES, PhoneInput } from 'baseui/phone-input';
import { Cell } from 'baseui/layout-grid';
import { useId } from 'react';
import { RenderObjectProps } from '../Render/RenderObject';
import { JSONObject } from '../type';
import { useFormValue } from '../Hooks/use-form-value';

export function PhoneNumber(props: RenderObjectProps) {
	const id = useId();
	const properties = Object.keys((props.field as JSONObject).properties ?? {});

	if (
		properties.length !== 2 ||
		properties.indexOf('country') === -1 ||
		properties.indexOf('phoneNumber') === -1
	) {
		throw new Error(
			"Two exact properties are needed named country, phoneNumber when format 'tel' is used."
		);
	}

	const [country, setCountry] = useFormValue(props.path + '/country');
	const [phoneNumber, setPhoneNumber] = useFormValue(
		props.path + '/phoneNumber'
	);

	return (
		<Cell {...((props.field as JSONObject).cellProps ?? { span: 12 })}>
			<FormControl
				htmlFor={id}
				label={
					<FormLabel
						title={(props.field as JSONObject).title}
						required={props.required}
					/>
				}
			>
				<PhoneInput
					country={Object.values(COUNTRIES).find(
						(res) => res.dialCode === country
					)}
					text={phoneNumber}
					required={props.required}
					onTextChange={(e) => setPhoneNumber(e.target.value)}
					onCountryChange={(e) => {
						setCountry(e.option?.dialCode);
					}}
					id={id}
				/>
			</FormControl>
		</Cell>
	);
}
