import { Button, SIZE } from 'baseui/button';
import { Block } from 'baseui/block';
import { HeadingLarge, HeadingMedium } from 'baseui/typography';
import React from 'react';
import { useStyletron } from 'baseui';
import { Link } from 'react-router-dom';
import { BrandingFooter } from '../../Features/Branding/Footer';
import { BrandingHeader } from '../../Features/Branding/Header';

export interface UnauthorizedLayoutProps {
	errorCode: number;
	errorMessage: string;
	homeUrl?: string;
}

export default function UnauthorizedLayout(props: UnauthorizedLayoutProps) {
	const [css] = useStyletron();

	return (
		<Block
			marginLeft="auto"
			marginRight="auto"
			width="100%"
			display="flex"
			height="100%"
			flexDirection="column"
			$style={{ textAlign: 'center' }}
		>
			<BrandingHeader />
			<Block
				placeContent="center"
				alignSelf="center"
				alignItems="center"
				display="flex"
				flexDirection="column"
				$style={{ flexGrow: 1 }}
			>
				<HeadingMedium marginTop={0} marginBottom="scale200">
					{props.errorCode}
				</HeadingMedium>
				<HeadingLarge marginTop="scale200" marginBottom="scale600">
					{props.errorMessage}
				</HeadingLarge>
				<div className={css({ marginLeft: 'auto', marginRight: 'auto' })}>
					<Button size={SIZE.compact} $as={Link} to={props.homeUrl ?? '/'}>
						GO HOME
					</Button>
				</div>
			</Block>
			<BrandingFooter />
		</Block>
	);
}
