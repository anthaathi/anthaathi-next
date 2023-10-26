import { HasChildren } from '../../Branding/Header';
import { useStyletron } from 'baseui';
import React from 'react';

export const DataTableWrapper = ({ children }: HasChildren) => {
	const [css, $theme] = useStyletron();

	return (
		<div
			className={css({
				border: `1px solid ${$theme.colors.borderOpaque}`,
			})}
		>
			{children}
		</div>
	);
};
