import { styled } from 'baseui';

export const Toolbar = styled('div', ({ $theme }) => ({
	display: 'grid',
	[$theme.mediaQuery.medium]: {
		display: 'flex',
	},
	alignItems: 'center',
}));
