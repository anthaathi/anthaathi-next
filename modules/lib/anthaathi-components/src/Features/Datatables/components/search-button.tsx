import React, { forwardRef } from 'react';
import { useStyletron } from 'baseui';
import { Button, SIZE } from 'baseui/button';
import { ChevronSortDown } from '@carbon/icons-react';
import { Search } from 'baseui/icon';

export const SearchButton = forwardRef((props, ref) => {
	const [css] = useStyletron();

	return (
		<Button
			ref={ref as never}
			size={SIZE.mini}
			endEnhancer={
				<ChevronSortDown
					size={16}
					className={css({ position: 'relative', top: '-4px' })}
				/>
			}
			overrides={{
				EndEnhancer: { style: { marginLeft: 0 } },
				Root: {
					style: {
						borderTopRightRadius: 0,
						borderBottomRightRadius: 0,
					},
				},
			}}
			{...props}
		>
			<Search size={20} />
		</Button>
	);
});
