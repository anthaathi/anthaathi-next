import { styled, useStyletron } from 'baseui';
import { colors } from 'baseui/tokens';
import React from 'react';

export enum BadgeSize {
	SMALL = 'small',
	DEFAULT = 'default',
	WIDE = 'wide',
}

const BADGE_LIST: Record<BadgeSize, string> = {
	[BadgeSize.DEFAULT]: '300px, 300px',
	[BadgeSize.SMALL]: '240px, 240px',
	[BadgeSize.WIDE]: '380px, 380px',
};

export interface BadgeListProps {
	$size?: BadgeSize;
	children: React.ReactNode;
}

export function BadgeList(props: BadgeListProps) {
	const [, $theme] = useStyletron();

	return (
		<Container
			$style={{
				[$theme.mediaQuery.medium]: {
					gridTemplateColumns: `repeat(auto-fill, minmax(${
						BADGE_LIST[props.$size ?? BadgeSize.DEFAULT]
					}))`,
				},
			}}
		>
			{/* @ts-ignore */}
			{Array.isArray(props.children)
				? React.Children.map(props.children, (child) =>
						React.isValidElement(child)
							? React.cloneElement(child, { size: props.$size } as never)
							: child
				  )
				: React.isValidElement(props.children)
				? React.cloneElement(props.children, { size: props.$size } as never)
				: null}
		</Container>
	);
}

export const Container = styled('div', ({ $theme }) => ({
	display: 'grid',
	gridTemplateColumns: 'repeat(auto-fill, 100%)',
	[$theme.mediaQuery.medium]: {
		gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 370px))',
	},
	gridGap: '16px',
	width: '100%',
}));

export const Circle = styled<
	'div',
	{ $color?: string; $hoverColor?: string; $size?: BadgeSize }
>('div', ({ $color = '#FFF', $hoverColor = '#007bff', $size }) => {
	let width;
	if ($size === BadgeSize.SMALL) {
		width = '70px';
	} else if ($size === BadgeSize.WIDE) {
		width = '120px';
	} else {
		width = '106px';
	}

	return {
		width: `${width}`,
		height: `${width}`,
		borderRadius: '50%',
		color: '#555',
		display: 'flex',
		alignItems: 'center',
		backgroundColor: $color,
		justifyContent: 'center',
		borderStyle: 'solid',
		borderWidth: '0',
		outline: '6px solid transparent',
		cursor: 'pointer',
		userSelect: 'none',
		borderColor: 'transparent',
		':hover': {
			outlineWidth: 0,
			borderColor: $hoverColor,
			borderWidth: '6px',
		},
		position: 'relative',
		transition:
			'border-color 0.3s ease-in-out, border-width 0.3s ease-in-out, outline-width 0.3s ease-in-out',
	};
});

export interface BadgeListItemProps {
	size?: BadgeSize;
	children: string | number | React.ReactNode;
	title: React.ReactNode;
	color?: string;
	borderColor?: string;
	onClick?: VoidFunction;
}

export function BadgeListItem(props: BadgeListItemProps) {
	return (
		<Info
			$size={props.size}
			$color={props.color ?? colors.blue700}
			$maxWidth={BADGE_LIST[props.size ?? BadgeSize.DEFAULT]}
			onClick={props.onClick}
		>
			<InformationValue $size={props.size}>
				<Circle
					$hoverColor={props.borderColor ?? props.color ?? colors.blue700}
					$size={props.size}
				>
					{props.children}
				</Circle>
			</InformationValue>
			<InformationTitle $size={props.size}>{props.title}</InformationTitle>
		</Info>
	);
}

export const InformationValue = styled<'span', { $size?: BadgeSize }>(
	'span',
	({ $theme, $size }) => {
		let fontSize;
		if ($size === BadgeSize.SMALL) {
			fontSize = $theme.typography.HeadingSmall;
		} else if ($size === BadgeSize.WIDE) {
			fontSize = $theme.typography.HeadingLarge;
		} else {
			fontSize = $theme.typography.HeadingXXLarge;
		}
		return {
			...fontSize,
			marginBottom: '12px',
			zIndex: 0,
		};
	}
);
export const Info = styled<
	'div',
	{ $color?: string; $maxWidth?: string; $size?: BadgeSize }
>('div', ({ $color, $maxWidth, $size }) => {
	let height: string;
	if ($size === BadgeSize.SMALL) {
		height = '130px';
	} else if ($size === BadgeSize.WIDE) {
		height = '200px';
	} else {
		height = '172px';
	}

	return {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'column',
		width: 'calc(100% - 16px)',
		height,
		borderRadius: '4px',
		boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
		fontSize: '14px',
		fontWeight: 500,
		padding: '8px',
		backgroundColor: $color ?? colors.blue700,
		color: '#ffffff',
		maxWidth: $maxWidth || undefined,
		':hover': {},
	};
});

export const InformationTitle = styled<'div', { $size?: BadgeSize }>(
	'div',
	({ $theme, $size }) => {
		let fontSize;
		if ($size === BadgeSize.SMALL) {
			fontSize = $theme.typography.LabelSmall;
		} else if ($size === BadgeSize.WIDE) {
			fontSize = $theme.typography.LabelLarge;
		} else {
			fontSize = $theme.typography.ParagraphMedium;
		}
		return {
			...fontSize,
			textAlign: 'center',
		};
	}
);
