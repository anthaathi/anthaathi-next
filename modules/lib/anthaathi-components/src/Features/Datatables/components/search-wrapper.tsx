import { styled } from 'baseui';

export const SearchWrapper = styled('div', ({ $theme }) => ({
	...$theme.typography.ParagraphSmall,
	padding: $theme.sizing.scale400,
	display: 'flex',
}));
