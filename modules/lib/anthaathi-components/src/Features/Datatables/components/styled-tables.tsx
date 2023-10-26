import { styled } from 'baseui';

export const Table = styled('table', {
	borderCollapse: 'collapse',
	width: '100%',
});

export const TableHead = styled('thead', ({ $theme }) => ({
	backgroundColor: $theme.colors.backgroundSecondary,
	color: $theme.colors.primary,
	...$theme.typography.LabelSmall,
	fontWeight: 600,
	position: 'sticky',
	top: 0,
	boxShadow: 'rgba(0, 0, 0, 0.16) 0px 2px 4px',
}));

export const TableBody = styled('tbody', {});

export const TableRow = styled('tr', {});

export const TableHeadCell = styled<
	'th',
	{ $isSortable?: boolean; $align?: 'center' | 'left' | 'right' }
>('th', ({ $isSortable, $align }) => ({
	border: '1px solid #ddd',
	padding: '6px',
	height: '26px',
	textAlign: $align ?? 'left',
	cursor: $isSortable ? 'pointer' : 'default',
}));

export const TableCell = styled<'td', { $align?: 'left' | 'right' | 'center' }>(
	'td',
	({ $theme, $align }) => ({
		border: '1px solid #ddd',
		padding: '6px',
		textAlign: $align ?? 'left',
		...$theme.typography.ParagraphSmall,
	})
);
