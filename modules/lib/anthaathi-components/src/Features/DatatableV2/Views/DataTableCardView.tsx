import { styled, useStyletron } from 'baseui';
import React from 'react';
import { DataTableAction, DataTableActionMethod } from '../type';
import { DataTableOverflowAction } from '../Components/DataTableOverflowAction';

export interface DataTableCardViewProps<T> {
	onItemClick?: (item: T, columnId?: string, newTab?: boolean) => void;
	data: T[];
	defaultIcon?: React.ReactElement;
	actions?: DataTableAction[];
	onAction?: DataTableActionMethod<T>;
}

export function DataTableCardView<
	T extends { title: string; icon?: React.ReactElement },
>(props: DataTableCardViewProps<T>) {
	const [css] = useStyletron();
	const [isHovered, setIsHovered] = React.useState<number | undefined>(
		undefined,
	);

	return (
		<CardWrapper data-testid="card-wrapper" role="listitem">
			{(props.data || []).map((data, index) => (
				<Card
					data-testid="card"
					key={index}
					onClick={() => props.onItemClick?.(data)}
					role="listitem"
					tabIndex={0}
					$style={{
						position: 'relative',
					}}
					onMouseEnter={() => {
						setIsHovered(index);
					}}
					onMouseLeave={() => {
						setIsHovered(index);
					}}
					onKeyUp={(e) => {
						if (
							!(e.code === 'Enter' || e.key === 'Enter' || e.keyCode === 13)
						) {
							return;
						}

						props.onItemClick?.(data, undefined, e.ctrlKey);
					}}
				>
					<div
						className={css({
							position: 'absolute',
							right: 0,
							opacity: isHovered === index ? 1 : 0,
						})}
					>
						<DataTableOverflowAction<T>
							actions={props.actions}
							row={data}
							onAction={props.onAction}
						/>
					</div>
					<CardContent data-testid="card-content">
						{(data.icon || props.defaultIcon) && (
							<CardIcon data-testid="card-icon">
								{React.cloneElement((data.icon ?? props.defaultIcon) as never, {
									size: 32,
									'data-testid': 'card-icon-content',
								})}
							</CardIcon>
						)}
						<CardTitle>{data.title}</CardTitle>
					</CardContent>
				</Card>
			))}
		</CardWrapper>
	);
}

const CardIcon = styled('div', ({ $theme }) => ({
	boxShadow: $theme.lighting.shadow400,
	padding: $theme.sizing.scale800,
	borderRadius: $theme.sizing.scale600,
	backgroundColor: $theme.colors.primaryB,
	width: '60%',
	display: 'flex',
	alignItems: 'center',
	placeContent: 'center',
}));

const CardTitle = styled('div', ({ $theme }) => ({
	...$theme.typography.ParagraphSmall,
	marginTop: $theme.sizing.scale300,
}));

const CardContent = styled('div', ({ $theme }) => ({
	display: 'flex',
	alignItems: 'center',
	placeContent: 'center',
	flexDirection: 'column',
	height: '100%',
}));

const Card = styled('div', ({ $theme }) => ({
	width: `calc(100% - ${$theme.sizing.scale200} - ${$theme.sizing.scale200})`,
	minHeight: '180px',
	borderRadius: $theme.sizing.scale600,
	cursor: 'pointer',
	transitionProperty: 'background-color',
	transitionDuration: '.05s',
	transitionTimingFunction: 'ease',
	':hover': {
		backgroundColor: $theme.colors.primary50,
	},
	':active': {
		backgroundColor: $theme.colors.primary50,
	},
	':focus': {
		outlineColor: $theme.colors.borderAccent,
	},
	userSelect: 'none',
}));

const CardWrapper = styled('div', ({ $theme }) => ({
	display: 'grid',
	gridTemplateColumns: 'repeat(auto-fill, minmax(100%, 1fr))',
	[$theme.mediaQuery.medium]: {
		gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
	},
	gap: `calc(${$theme.sizing.scale100} +  ${$theme.sizing.scale100} + ${$theme.sizing.scale100} + ${$theme.sizing.scale100})`,
	paddingLeft: `calc(${$theme.sizing.scale0} + ${$theme.sizing.scale0} + ${$theme.sizing.scale0} + ${$theme.sizing.scale0})`,
	paddingRight: `calc(${$theme.sizing.scale0} + ${$theme.sizing.scale0} + ${$theme.sizing.scale0} + ${$theme.sizing.scale0})`,
	paddingTop: `calc(${$theme.sizing.scale0} + ${$theme.sizing.scale0} + ${$theme.sizing.scale0} + ${$theme.sizing.scale0})`,
	paddingBottom: `calc(${$theme.sizing.scale0} + ${$theme.sizing.scale0} + ${$theme.sizing.scale0} + ${$theme.sizing.scale0})`,
	placeContent: 'center',
	justifyContent: 'flex-start',
	width: '100%',
}));
