import { styled, useStyletron } from 'baseui';
import { LabelMedium } from 'baseui/typography';
import { HasChildren } from '../Header';

export function BrandingFooter() {
	const [css] = useStyletron();

	return (
		<FooterWrapper>
			<FooterLabel>
				&copy; {new Date().getFullYear()} Anthaathi. All rights reserved.
			</FooterLabel>

			<span className={css({ flexGrow: 1 })} />

			<FooterLink
				href="https://github.com/anthaathi"
				target="_blank"
				rel="noreferrer"
			>
				Github
			</FooterLink>

			<FooterSpacer />

			<FooterLink href="https://anthaathi.org" target="_blank" rel="noreferrer">
				Website
			</FooterLink>
		</FooterWrapper>
	);
}

export const FooterSpacer = styled('div', ({ $theme }) => ({
	width: $theme.sizing.scale200,
}));

export const FooterLink = styled('a', ({ $theme }) => ({
	color: $theme.colors.backgroundPrimary,
	textDecoration: 'none',
	...$theme.typography.LabelMedium,
	':hover': {
		textDecoration: 'underline',
	},
}));

export const FooterLabel = ({ children }: HasChildren) => {
	const [, $theme] = useStyletron();

	return (
		<LabelMedium $style={{ color: $theme.colors.backgroundPrimary }}>
			{children}
		</LabelMedium>
	);
};

export const FooterWrapper = styled('footer', ({ $theme }) => ({
	backgroundColor: 'var(--branding-header-background-color, #151515)',
	boxShadow: $theme.lighting.shadow500,
	height: '74px',
	display: 'flex',
	alignItems: 'center',
	paddingLeft: $theme.sizing.scale800,
	paddingRight: $theme.sizing.scale800,
}));
