/*
 * Copyright (c) Anthaathi Private Limited 2023.
 *
 * This code is the exclusive property of Anthaathi Private Limited and is protected by copyright and intellectual property laws.
 * Any unauthorized use, reproduction, distribution, or modification of this code is strictly prohibited.
 *
 * Anthaathi Private Limited reserves all rights in and to this code and will vigorously defend its intellectual property rights.
 */

import React, { useContext } from 'react';
import { Session } from '../components/AuthWrapper/type';

export const KratosContext = React.createContext<{
	authBaseURL: string;
} | null>(null);

export const useKratos = () => {
	const client = useContext(KratosContext);

	if (!client) {
		throw new Error('No client is registered for kratos');
	}

	return client;
};

export const SessionInfo = React.createContext<Session | null>(null);

export const useSession = () => useContext(SessionInfo);
