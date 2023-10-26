import React, { useRef, useState } from 'react';
import { styled, useStyletron } from 'baseui';
import { LabelXSmall } from 'baseui/typography';
import { StatefulTooltip } from 'baseui/tooltip';
import { PLACEMENT } from 'baseui/popover';
import { expandBorderStyles } from 'baseui/styles';
import { Add } from '@carbon/icons-react';

interface AvatarStackItem {
	title: string;
	tooltip?: string;
	img?: string;
	key: string;
}

export interface AvatarStackProps {
	// eslint-disable-next-line no-unused-vars
	onClick?: (
		item: AvatarStackItem,
		event: React.MouseEvent<HTMLElement>
	) => void;
	items: AvatarStackItem[];
	align?: 'end' | 'start';
	canAssign?: boolean;
	onAssign?: (event: React.MouseEvent<HTMLElement>) => void;
}

export default function AvatarStack({
	items,
	onClick,
	align = 'end',
	canAssign,
	onAssign,
}: AvatarStackProps) {
	const [css] = useStyletron();

	const [hover, setHover] = useState(false);

	const prevClear = useRef<number | undefined>(undefined);

	return (
		<div
			className={css({
				display: 'flex',
				position: 'relative',
				height: '28px',
			})}
		>
			{canAssign && (
				<AvatarItem
					tabIndex={0}
					$index={0}
					$totalItem={items.length - -1}
					onClick={onAssign}
					$style={{
						[align === 'end' ? 'right' : 'left']: 0,
					}}
				>
					<Add />
				</AvatarItem>
			)}
			{items.map((item, index) => {
				const initial = item.title
					.split(' ')
					.map((res) => res[0])
					.join('')
					.substring(0, 2)
					.toUpperCase();

				return (
					<StatefulTooltip
						content={() => item.tooltip ?? item.title}
						returnFocus
						autoFocus
						popoverMargin={8}
						showArrow
						onMouseEnterDelay={500}
						placement={PLACEMENT.bottom}
						key={item.key}
					>
						<AvatarItem
							tabIndex={0}
							$index={index}
							$totalItem={items.length}
							$style={{
								[align === 'start' ? 'left' : 'right']:
									(28 / (hover ? 0.9 : 2.5)) * (index + (canAssign ? 1 : 0)) +
									'px',
								transitionProperty: align === 'start' ? 'left' : 'right',
							}}
							className={css({})}
							onMouseOver={() => {
								setHover(true);
								clearTimeout(prevClear.current);
							}}
							onMouseOut={() => {
								prevClear.current = setTimeout(() => {
									setHover(false);
								}, 50) as never as number;
							}}
							onClick={(event) => {
								onClick?.(item, event);
							}}
						>
							<LabelXSmall $style={{ fontWeight: 600, wordSpacing: '0' }}>
								{initial}
							</LabelXSmall>
						</AvatarItem>
					</StatefulTooltip>
				);
			})}
		</div>
	);
}

export const AvatarItem = styled<'div', { $index: number; $totalItem: number }>(
	'div',
	({ $theme, $index, $totalItem }) => ({
		width: '28px',
		height: '28px',
		display: 'flex',
		alignItems: 'center',
		placeContent: 'center',
		backgroundColor: $theme.colors.backgroundAccentLight,
		borderRadius: '50%',
		position: 'absolute',
		transitionDuration: '200ms',
		transitionTimingFunction: 'ease',
		cursor: 'pointer',
		zIndex: $totalItem - $index,
		...expandBorderStyles($theme.borders.border100),
		':focus': {
			...expandBorderStyles($theme.borders.border100),
		},
	})
);
