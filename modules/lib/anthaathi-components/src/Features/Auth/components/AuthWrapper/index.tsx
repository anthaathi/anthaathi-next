/*
 * Copyright (c) Anthaathi Private Limited 2023.
 *
 * This code is the exclusive property of Anthaathi Private Limited and is protected by copyright and intellectual property laws.
 * Any unauthorized use, reproduction, distribution, or modification of this code is strictly prohibited.
 *
 * Anthaathi Private Limited reserves all rights in and to this code and will vigorously defend its intellectual property rights.
 */

import { SessionInfo, useKratos } from '../../context/KratosContext';
import React, { useEffect, useState } from 'react';
import { Session } from './type';
import { useIntl } from 'react-intl';
import { Modal, ModalButton, ModalFooter, ModalHeader } from 'baseui/modal';

export interface AuthWrapperProps {
	requireLogin?: boolean;
	verificationRequired?: boolean;
	children: React.ReactNode;
	useKratosUrl?: boolean;
}

export function AuthWrapper(props: AuthWrapperProps) {
	const verificationRequired = props.verificationRequired ?? false;

	const kratos = useKratos();
	const [session, setSession] = useState<Session | null>(null);

	const [isModalOpen, setIsOpen] = useState(false);

	useEffect(() => {
		const controller = new AbortController();
		const signal = controller.signal;

		fetch((props.useKratosUrl ? kratos.authBaseURL : '') + `/sessions/whoami`, {
			signal,
			credentials: 'include',
		})
			.then((docs) => {
				if (docs.status !== 200 && props.requireLogin) {
					window.location.href = `${
						kratos.authBaseURL
					}/v1/sign-in?return-url=${encodeURIComponent(window.location.href)}`;
					return;
				}

				return docs.json();
			})
			// @ts-ignore
			.then((docs: Session) => {
				if (docs) {
					setSession(docs);

					setIsOpen(
						docs.identity.verifiable_addresses?.findIndex(
							(res) => res.status === 'completed'
						) === -1
					);
				}
			});

		return () => {
			controller.abort();
		};
	}, [kratos, props.requireLogin, props.useKratosUrl]);

	const intl = useIntl();

	if (!session && props.requireLogin) {
		return null;
	}

	return (
		<SessionInfo.Provider value={session}>
			<Modal
				isOpen={isModalOpen}
				closeable={
					!verificationRequired ||
					session?.identity.verifiable_addresses?.length !== 0
				}
			>
				<ModalHeader>
					{intl.formatMessage({
						defaultMessage:
							'Please confirm your email address to fully utilize the application.',
					})}
				</ModalHeader>
				<ModalFooter>
					<ModalButton
						onClick={() => {
							window.open(`${kratos.authBaseURL}/v1/verification`, '_self');
						}}
						data-testid="email-verification-verify"
					>
						{intl.formatMessage({ defaultMessage: 'Verify' })}
					</ModalButton>
					<ModalButton
						onClick={() => setIsOpen(false)}
						data-testid="email-verification-remind-me-later"
					>
						{intl.formatMessage({ defaultMessage: 'Remind me later' })}
					</ModalButton>
				</ModalFooter>
			</Modal>

			{props.children}
		</SessionInfo.Provider>
	);
}
