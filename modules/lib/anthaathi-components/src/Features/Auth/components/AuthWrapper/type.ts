/*
 * Copyright (c) Anthaathi Private Limited 2023.
 *
 * This code is the exclusive property of Anthaathi Private Limited and is protected by copyright and intellectual property laws.
 * Any unauthorized use, reproduction, distribution, or modification of this code is strictly prohibited.
 *
 * Anthaathi Private Limited reserves all rights in and to this code and will vigorously defend its intellectual property rights.
 */

/* eslint-disable */

export const AuthenticatorAssuranceLevel = {
	Aal0: 'aal0',
	Aal1: 'aal1',
	Aal2: 'aal2',
	Aal3: 'aal3',
} as const;

export type AuthenticatorAssuranceLevel =
	typeof AuthenticatorAssuranceLevel[keyof typeof AuthenticatorAssuranceLevel];

export const SessionAuthenticationMethodMethodEnum = {
	LinkRecovery: 'link_recovery',
	CodeRecovery: 'code_recovery',
	Password: 'password',
	Totp: 'totp',
	Oidc: 'oidc',
	Webauthn: 'webauthn',
	LookupSecret: 'lookup_secret',
	V06LegacySession: 'v0.6_legacy_session',
} as const;

export type SessionAuthenticationMethodMethodEnum =
	typeof SessionAuthenticationMethodMethodEnum[keyof typeof SessionAuthenticationMethodMethodEnum];

export interface SessionAuthenticationMethod {
	/**
	 *
	 * @type {AuthenticatorAssuranceLevel}
	 * @memberof SessionAuthenticationMethod
	 */
	aal?: AuthenticatorAssuranceLevel;
	/**
	 * When the authentication challenge was completed.
	 * @type {string}
	 * @memberof SessionAuthenticationMethod
	 */
	completed_at?: string;
	/**
	 *
	 * @type {string}
	 * @memberof SessionAuthenticationMethod
	 */
	method?: SessionAuthenticationMethodMethodEnum;
}

export interface Session {
	/**
	 * Active state. If false the session is no longer active.
	 * @type {boolean}
	 * @memberof Session
	 */
	active?: boolean;
	/**
	 * The Session Authentication Timestamp  When this session was authenticated at. If multi-factor authentication was used this is the time when the last factor was authenticated (e.g. the TOTP code challenge was completed).
	 * @type {string}
	 * @memberof Session
	 */
	authenticated_at?: string;
	/**
	 * A list of authenticators which were used to authenticate the session.
	 * @type {Array<SessionAuthenticationMethod>}
	 * @memberof Session
	 */
	authentication_methods?: Array<SessionAuthenticationMethod>;
	/**
	 *
	 * @type {AuthenticatorAssuranceLevel}
	 * @memberof Session
	 */
	authenticator_assurance_level?: AuthenticatorAssuranceLevel;
	/**
	 * Devices has history of all endpoints where the session was used
	 * @type {Array<SessionDevice>}
	 * @memberof Session
	 */
	devices?: Array<SessionDevice>;
	/**
	 * The Session Expiry  When this session expires at.
	 * @type {string}
	 * @memberof Session
	 */
	expires_at?: string;
	/**
	 * Session ID
	 * @type {string}
	 * @memberof Session
	 */
	id: string;
	/**
	 *
	 * @type {Identity}
	 * @memberof Session
	 */
	identity: Identity;
	/**
	 * The Session Issuance Timestamp  When this session was issued at. Usually equal or close to `authenticated_at`.
	 * @type {string}
	 * @memberof Session
	 */
	issued_at?: string;
}

/**
 * Credentials represents a specific credential type
 * @export
 * @interface IdentityCredentials
 */
export interface IdentityCredentials {
	/**
	 *
	 * @type {object}
	 * @memberof IdentityCredentials
	 */
	config?: object;
	/**
	 * CreatedAt is a helper struct field for gobuffalo.pop.
	 * @type {string}
	 * @memberof IdentityCredentials
	 */
	created_at?: string;
	/**
	 * Identifiers represents a list of unique identifiers this credential type matches.
	 * @type {Array<string>}
	 * @memberof IdentityCredentials
	 */
	identifiers?: Array<string>;
	/**
	 *
	 * @type {IdentityCredentialsType}
	 * @memberof IdentityCredentials
	 */
	type?: IdentityCredentialsType;
	/**
	 * UpdatedAt is a helper struct field for gobuffalo.pop.
	 * @type {string}
	 * @memberof IdentityCredentials
	 */
	updated_at?: string;
	/**
	 * Version refers to the version of the credential. Useful when changing the config schema.
	 * @type {number}
	 * @memberof IdentityCredentials
	 */
	version?: number;
}

export const IdentityCredentialsType = {
	Password: 'password',
	Totp: 'totp',
	Oidc: 'oidc',
	Webauthn: 'webauthn',
	LookupSecret: 'lookup_secret',
} as const;

export type IdentityCredentialsType =
	typeof IdentityCredentialsType[keyof typeof IdentityCredentialsType];

/**
 * The state can either be `active` or `inactive`.
 * @export
 * @enum {string}
 */

export const IdentityState = {
	Active: 'active',
	Inactive: 'inactive',
} as const;

export type IdentityState = typeof IdentityState[keyof typeof IdentityState];

/**
 * An [identity](https://www.ory.sh/docs/kratos/concepts/identity-user-model) represents a (human) user in Ory.
 * @export
 * @interface Identity
 */
export interface Identity {
	/**
	 * CreatedAt is a helper struct field for gobuffalo.pop.
	 * @type {string}
	 * @memberof Identity
	 */
	created_at?: string;
	/**
	 * Credentials represents all credentials that can be used for authenticating this identity.
	 * @type {{ [key: string]: IdentityCredentials; }}
	 * @memberof Identity
	 */
	credentials?: { [key: string]: IdentityCredentials };
	/**
	 * ID is the identity\'s unique identifier.  The Identity ID can not be changed and can not be chosen. This ensures future compatibility and optimization for distributed stores such as CockroachDB.
	 * @type {string}
	 * @memberof Identity
	 */
	id: string;
	/**
	 * NullJSONRawMessage represents a json.RawMessage that works well with JSON, SQL, and Swagger and is NULLable-
	 * @type {any}
	 * @memberof Identity
	 */
	metadata_admin?: any | null;
	/**
	 * NullJSONRawMessage represents a json.RawMessage that works well with JSON, SQL, and Swagger and is NULLable-
	 * @type {any}
	 * @memberof Identity
	 */
	metadata_public?: any | null;
	/**
	 * RecoveryAddresses contains all the addresses that can be used to recover an identity.
	 * @type {Array<RecoveryIdentityAddress>}
	 * @memberof Identity
	 */
	recovery_addresses?: Array<RecoveryIdentityAddress>;
	/**
	 * SchemaID is the ID of the JSON Schema to be used for validating the identity\'s traits.
	 * @type {string}
	 * @memberof Identity
	 */
	schema_id: string;
	/**
	 * SchemaURL is the URL of the endpoint where the identity\'s traits schema can be fetched from.  format: url
	 * @type {string}
	 * @memberof Identity
	 */
	schema_url: string;
	/**
	 *
	 * @type {IdentityState}
	 * @memberof Identity
	 */
	state?: IdentityState;
	/**
	 *
	 * @type {string}
	 * @memberof Identity
	 */
	state_changed_at?: string;
	/**
	 * Traits represent an identity\'s traits. The identity is able to create, modify, and delete traits in a self-service manner. The input will always be validated against the JSON Schema defined in `schema_url`.
	 * @type {any}
	 * @memberof Identity
	 */
	traits: any;
	/**
	 * UpdatedAt is a helper struct field for gobuffalo.pop.
	 * @type {string}
	 * @memberof Identity
	 */
	updated_at?: string;
	/**
	 * VerifiableAddresses contains all the addresses that can be verified by the user.
	 * @type {Array<VerifiableIdentityAddress>}
	 * @memberof Identity
	 */
	verifiable_addresses?: Array<VerifiableIdentityAddress>;
}

/**
 * VerifiableAddress is an identity\'s verifiable address
 * @export
 * @interface VerifiableIdentityAddress
 */
export interface VerifiableIdentityAddress {
	/**
	 * When this entry was created
	 * @type {string}
	 * @memberof VerifiableIdentityAddress
	 */
	created_at?: string;
	/**
	 * The ID
	 * @type {string}
	 * @memberof VerifiableIdentityAddress
	 */
	id?: string;
	/**
	 * VerifiableAddressStatus must not exceed 16 characters as that is the limitation in the SQL Schema
	 * @type {string}
	 * @memberof VerifiableIdentityAddress
	 */
	status: string;
	/**
	 * When this entry was last updated
	 * @type {string}
	 * @memberof VerifiableIdentityAddress
	 */
	updated_at?: string;
	/**
	 * The address value  example foo@user.com
	 * @type {string}
	 * @memberof VerifiableIdentityAddress
	 */
	value: string;
	/**
	 * Indicates if the address has already been verified
	 * @type {boolean}
	 * @memberof VerifiableIdentityAddress
	 */
	verified: boolean;
	/**
	 *
	 * @type {string}
	 * @memberof VerifiableIdentityAddress
	 */
	verified_at?: string;
	/**
	 * VerifiableAddressType must not exceed 16 characters as that is the limitation in the SQL Schema
	 * @type {string}
	 * @memberof VerifiableIdentityAddress
	 */
	via: string;
}

/**
 *
 * @export
 * @interface RecoveryIdentityAddress
 */
export interface RecoveryIdentityAddress {
	/**
	 * CreatedAt is a helper struct field for gobuffalo.pop.
	 * @type {string}
	 * @memberof RecoveryIdentityAddress
	 */
	created_at?: string;
	/**
	 *
	 * @type {string}
	 * @memberof RecoveryIdentityAddress
	 */
	id: string;
	/**
	 * UpdatedAt is a helper struct field for gobuffalo.pop.
	 * @type {string}
	 * @memberof RecoveryIdentityAddress
	 */
	updated_at?: string;
	/**
	 *
	 * @type {string}
	 * @memberof RecoveryIdentityAddress
	 */
	value: string;
	/**
	 *
	 * @type {string}
	 * @memberof RecoveryIdentityAddress
	 */
	via: string;
}

/**
 * Device corresponding to a Session
 * @export
 * @interface SessionDevice
 */
export interface SessionDevice {
	/**
	 * Device record ID
	 * @type {string}
	 * @memberof SessionDevice
	 */
	id: string;
	/**
	 * IPAddress of the client
	 * @type {string}
	 * @memberof SessionDevice
	 */
	ip_address?: string;
	/**
	 * Geo Location corresponding to the IP Address
	 * @type {string}
	 * @memberof SessionDevice
	 */
	location?: string;
	/**
	 * UserAgent of the client
	 * @type {string}
	 * @memberof SessionDevice
	 */
	user_agent?: string;
}
