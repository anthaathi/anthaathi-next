/*
 * Copyright (c) Anthaathi Private Limited 2023.
 *
 * This code is the exclusive property of Anthaathi Private Limited and is protected by copyright and intellectual property laws.
 * Any unauthorized use, reproduction, distribution, or modification of this code is strictly prohibited.
 *
 * Anthaathi Private Limited reserves all rights in and to this code and will vigorously defend its intellectual property rights.
 */

import { Configuration, FrontendApi } from '@ory/kratos-client';

const DEFAULT_ORY_SDK_URL =
	typeof window === 'undefined'
		? 'http://localhost:4433'
		: 'http://account.anthaathi.localhost:4443';

const ORY_SDK_URL_ENV = process.env.NEXT_PUBLIC_ORY_SDK_URL;

export const ORY_OKTA_ENDPOINT = ORY_SDK_URL_ENV ?? DEFAULT_ORY_SDK_URL;

// eslint-disable-next-line import/no-anonymous-default-export
const frontend = new FrontendApi(
	new Configuration({
		//https://vitejs.dev/guide/env-and-mode.html#env-files
		basePath: ORY_OKTA_ENDPOINT,
		// we always want to include the cookies in each request
		// cookies are used for sessions and CSRF protection
		baseOptions: {
			withCredentials: true,
		},
	}),
);

export default frontend;
