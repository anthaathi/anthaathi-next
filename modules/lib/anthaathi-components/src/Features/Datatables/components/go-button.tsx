import { useStyletron } from 'baseui';
import { Button, KIND, SIZE } from 'baseui/button';
import { expandBorderStyles } from 'baseui/styles';
import React from 'react';

export const GoButton = (props: { onClick: () => void }) => {
	const [, $theme] = useStyletron();

	return (
		<Button
			onClick={props.onClick}
			size={SIZE.mini}
			kind={KIND.secondary}
			overrides={{
				Root: {
					style: {
						minWidth: '40px',
						borderTopLeftRadius: 0,
						borderBottomLeftRadius: 0,
						borderLeftStyle: 'solid',
						...expandBorderStyles($theme.borders.border300),
						fontSize: '14px',
					},
				},
			}}
		>
			Go
		</Button>
	);
};
