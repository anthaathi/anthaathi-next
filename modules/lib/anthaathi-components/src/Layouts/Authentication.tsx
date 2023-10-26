import React from 'react';
import { BrandingHeader } from '../Features/Branding/Header';
import { BrandingFooter } from '../Features/Branding/Footer';

export interface AuthenticationProps {
	children: React.ReactNode;
}

export default function Authentication(props: AuthenticationProps) {
	return (
		<>
			<BrandingHeader />
			<>
				<div>{props.children}</div>
			</>
			<BrandingFooter />
		</>
	);
}
