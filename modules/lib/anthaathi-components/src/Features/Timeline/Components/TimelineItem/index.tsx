import { styled } from 'baseui';
import { expandBorderStyles } from 'baseui/styles';

export const TimelineItem = styled('div', ({ $theme }) => ({
	position: 'relative',
	display: 'flex',
	padding: '16px 0',
	marginLeft: '16px',
	'::before': {
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		display: 'block',
		width: '2px',
		content: "''",
		backgroundColor: $theme.colors.borderOpaque,
	},
}));

export const TimelineBadge = styled('div', ({ $theme }) => ({
	position: 'relative',
	zIndex: 1,
	display: 'flex',
	width: '32px',
	height: '32px',
	marginRight: '8px',
	marginLeft: '-15px',
	color: $theme.colors.primaryA,
	alignItems: 'center',
	backgroundColor: $theme.colors.backgroundSecondary,
	...expandBorderStyles($theme.borders.border100),
	borderRadius: '50%',
	justifyContent: 'center',
	flexShrink: 0,
}));

export const TimelineItemBody = styled('div', ({ $theme }) => ({
	minWidth: 0,
	maxWidth: '100%',
	marginTop: '4px',
	flex: 'auto',
	...$theme.typography.ParagraphMedium,
}));

export const TimelineItemBreak = styled('div', ({ $theme }) => ({
	position: 'relative',
	zIndex: 1,
	height: '24px',
	marginBottom: '-16px',
	borderTopColor: $theme.borders.border400.borderColor,
	borderTopWidth: '4px',
	borderTopStyle: $theme.borders.border400.borderStyle as never,
	backgroundColor: $theme.colors.primaryB,
}));
