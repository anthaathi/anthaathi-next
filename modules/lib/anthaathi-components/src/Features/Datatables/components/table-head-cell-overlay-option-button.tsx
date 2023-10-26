import { styled } from 'baseui';

export const TableHeadCellOverlayOptionButton = styled<
	'button',
	{ $active?: boolean }
>('button', ({ $theme, $active }) => ({
	border: 'none',
	flexGrow: 1,
	cursor: 'pointer',
	backgroundColor: $active ? $theme.colors.backgroundTertiary : 'transparent',
}));
export const TableHeadCellOverlayOption = styled('div', {
	position: 'absolute',
	right: '0',
	top: '0',
	bottom: '0',
	display: 'flex',
	alignItems: 'center',
	placeContent: 'center',
	flexDirection: 'column',
});
