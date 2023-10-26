import { useStyletron } from 'baseui';
import React from 'react';

export interface FormLabelProps {
	title: React.ReactNode;
	required?: boolean;
}

export function FormLabel(props: FormLabelProps) {
	const [css, $theme] = useStyletron();

	return (
		<>
			{props.title}
			{props.required && (
				<span
					className={css({
						color: $theme.colors.inputBorderError,
						paddingLeft: $theme.sizing.scale100,
					})}
				>
					*
				</span>
			)}
		</>
	);
}
