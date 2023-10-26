import { styled, useStyletron } from 'baseui';
import { Link } from 'react-router-dom';
import React from 'react';
import { HeadingXSmall, LabelXSmall } from 'baseui/typography';
import { FlexFill } from '../../Header';
import { User, Workspace } from '@carbon/icons-react';

export function BrandingHeader() {
	const [css, $theme] = useStyletron();

	return (
		<BrandingHeaderWrapper>
			<Link to="/" className={css({ textDecoration: 'none' })}>
				<HeadingXSmall
					marginTop={0}
					marginBottom={0}
					$style={{ color: $theme.colors.backgroundPrimary }}
				>
					Anthaathi
				</HeadingXSmall>
			</Link>

			<FlexFill />

			<BrandingHeaderIconButton>
				<BrandingHeaderIconItem>
					<Workspace />
				</BrandingHeaderIconItem>
				<LabelXSmall $style={{ color: $theme.colors.backgroundPrimary }}>
					All Anthaathi
				</LabelXSmall>
			</BrandingHeaderIconButton>

			<BrandingHeaderIconButton>
				<BrandingHeaderIconItem>
					<User />
				</BrandingHeaderIconItem>
				<LabelXSmall $style={{ color: $theme.colors.backgroundPrimary }}>
					Register
				</LabelXSmall>
			</BrandingHeaderIconButton>
		</BrandingHeaderWrapper>
	);
}

export interface HasChildren {
	children: React.ReactNode;
}

export const BrandingHeaderIconButton = ({ children }: HasChildren) => {
	const [css, $theme] = useStyletron();

	return (
		<button
			className={css({
				height: '100%',
				borderRadius: 0,
				borderLeft: 'none',
				borderRight: 'none',
				borderBottom: 'none',
				borderTop: '4px solid transparent',
				minWidth: '74px',
				paddingLeft: $theme.sizing.scale600,
				paddingRight: $theme.sizing.scale600,
				cursor: 'pointer',
				display: 'flex',
				alignItems: 'center',
				flexDirection: 'column',
				placeContent: 'center',
				outline: 'none',
				backgroundColor: 'transparent',
				color: $theme.colors.backgroundPrimary,
				':hover': {
					borderTop: `4px solid ${$theme.colors.accent}`,
					backgroundColor: $theme.colors.backgroundInverseSecondary,
				},
				':focus': {
					borderTop: `4px solid ${$theme.colors.accent}`,
					backgroundColor: $theme.colors.backgroundInverseSecondary,
				},
				':active': {
					borderTop: `4px solid ${$theme.colors.accent}`,
					backgroundColor: $theme.colors.backgroundInverseSecondary,
				},
			})}
		>
			{children}
		</button>
	);
};

export const BrandingHeaderIconItem = ({ children }: HasChildren) => {
	const [css] = useStyletron();

	return <div className={css({ marginBottom: '2px' })}>{children}</div>;
};

const BrandingHeaderWrapper = styled('div', ({ $theme }) => ({
	height: '72px',
	paddingLeft: $theme.sizing.scale800,
	paddingRight: $theme.sizing.scale800,
	display: 'flex',
	alignItems: 'center',
	backgroundColor: 'var(--branding-header-background-color, #151515)',
}));
