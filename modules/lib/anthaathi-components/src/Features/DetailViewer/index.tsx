import { styled, useStyletron } from 'baseui';
import React from 'react';
import { StatefulPopover } from 'baseui/popover';
import { Button, KIND, SHAPE, SIZE } from 'baseui/button';
import { OverflowMenuVertical } from '@carbon/icons-react';
import { Items, StatefulMenu } from 'baseui/menu';
import { StyletronComponent } from 'styletron-react';

export interface DetailViewerProps
	extends React.ComponentProps<StyletronComponent<'div', {}>> {
	titleIcon?: React.ReactNode;
	title?: React.ReactNode;
	action?: React.ReactNode;
	children: React.ReactNode | React.ReactNode[];
	$outlined?: boolean;
}

export default function DetailViewerCard(props: DetailViewerProps) {
	const { title, titleIcon, action, children, ...restProps } = props;
	const [, $theme] = useStyletron();

	if (import.meta.env.DEV) {
		if (Object.keys(props.$style || {}).findIndex(res => res.includes('border')) !== -1) {
			console.warn('DetailViewerCard: Please use $outlined prop instead of border styles');
		}
	}

	return (
		<Card
			{...restProps}
			$style={{
				...restProps.$style,

				...(props.$outlined
					? {
							borderWidth: '1px',
							borderStyle: 'solid',
							borderColor: props.$outlined
								? $theme.colors.borderOpaque
								: 'transparent',
							boxShadow: 'none',
					  }
					: {}),
			}}
		>
			{(titleIcon || title || action) && (
				<CardTitle>
					{titleIcon}
					{titleIcon && <CardSpacer />}
					{title}
					<CardTitleSpacer />
					{action && <CardActionWrapped>{action}</CardActionWrapped>}
				</CardTitle>
			)}
			{children}
		</Card>
	);
}

export const CardContent = styled('div', ({ $theme }) => ({
	paddingLeft: $theme.sizing.scale700,
	paddingRight: $theme.sizing.scale700,
	paddingTop: $theme.sizing.scale400,
	paddingBottom: $theme.sizing.scale400,
}));

export const CardAction = styled('div', ({ $theme }) => ({
	paddingLeft: $theme.sizing.scale700,
	paddingRight: $theme.sizing.scale700,
	paddingTop: $theme.sizing.scale400,
	paddingBottom: $theme.sizing.scale400,
	borderBottomLeftRadius: $theme.borders.useRoundedCorners
		? $theme.borders.radius300
		: 0,
	borderBottomRightRadius: $theme.borders.useRoundedCorners
		? $theme.borders.radius300
		: 0,
	display: 'flex',
}));

export const CardSubheading = styled('div', ({ $theme }) => ({
	display: 'flex',
	alignItems: 'center',
	paddingLeft: $theme.sizing.scale700,
	paddingRight: $theme.sizing.scale700,
	paddingTop: $theme.sizing.scale400,
	paddingBottom: $theme.sizing.scale400,
	...$theme.typography.LabelSmall,
	fontWeight: 700,
	borderTopLeftRadius: $theme.borders.useRoundedCorners
		? $theme.borders.radius300
		: 0,
	borderTopRightRadius: $theme.borders.useRoundedCorners
		? $theme.borders.radius300
		: 0,
}));

const CardActionWrapped = styled('div', {
	display: 'flex',
	alignItems: 'center',
	placeContent: 'center',
});

const CardTitleSpacer = styled('div', {
	flex: 1,
});

export const DetailViewerActionVertMenu = (props: { items: Items }) => {
	return (
		<StatefulPopover
			placement="bottomRight"
			content={
				<StatefulMenu
					overrides={{
						List: {
							style: {
								minWidth: '140px',
							},
						},
					}}
					items={props.items}
				/>
			}
		>
			<Button size={SIZE.compact} shape={SHAPE.square} kind={KIND.secondary}>
				<OverflowMenuVertical />
			</Button>
		</StatefulPopover>
	);
};

const CardSpacer = styled('div', {
	width: '.6rem',
});

export const CardTitle = styled('h2', ({ $theme }) => ({
	...$theme.typography.ParagraphMedium,
	fontWeight: 'bold',
	marginTop: 0,
	marginBottom: 0,
	display: 'flex',
	alignItems: 'center',
	paddingLeft: $theme.sizing.scale700,
	paddingRight: $theme.sizing.scale700,
	paddingTop: $theme.sizing.scale600,
	paddingBottom: $theme.sizing.scale400,
}));

export const Card = styled('div', ({ $theme }) => ({
	boxShadow: '0 0 0.3125rem #1718180d,0 0.0625rem 0.125rem #00000026',
	backgroundColor: $theme.colors.backgroundPrimary,
	borderTopLeftRadius: $theme.borders.radius300,
	borderTopRightRadius: $theme.borders.radius300,
	borderBottomLeftRadius: $theme.borders.radius300,
	borderBottomRightRadius: $theme.borders.radius300,
}));

export const CardDivider = styled('div', ({ $theme }) => ({
	borderTopWidth: '1px',
	borderTopStyle: 'solid',
	borderTopColor: $theme.colors.backgroundTertiary,
}));
