import { useStyletron } from 'baseui';
import { Input } from 'baseui/input';
import { SIZE } from 'baseui/button';
import { expandBorderStyles } from 'baseui/styles';
import React, { forwardRef } from 'react';

export const SearchInput = forwardRef<
	HTMLInputElement,
	{
		searchTerm: string;
		selectedFieldType: string;
		onChange: (str: string) => void;
		onEnter: () => void;
	}
>((props, ref) => {
	const [, $theme] = useStyletron();

	let searchFor = props.selectedFieldType;

	switch (props.selectedFieldType) {
		case '::all::':
			searchFor = 'all text fields';
			break;
		case '::caseSensitive::':
			searchFor = 'case sensitive';
			break;
	}

	return (
		<Input
			placeholder={`Search ${searchFor}`}
			size={SIZE.compact}
			inputRef={ref as never}
			onKeyUp={(e) => {
				if (e.key === 'Enter') {
					props.onEnter();
				} else if (e.keyCode === 13) {
					props.onEnter();
				}
			}}
			value={props.searchTerm}
			onChange={(e) => props.onChange(e.currentTarget.value)}
			overrides={{
				Root: {
					style: {
						height: '36px',
						borderTopLeftRadius: 0,
						borderBottomLeftRadius: 0,
						borderTopRightRadius: 0,
						borderBottomRightRadius: 0,
						...expandBorderStyles($theme.borders.border300),
						borderRightStyle: 'none',
					},
				},
			}}
		/>
	);
});
