/*
 * Copyright (c) Anthaathi Private Limited 2022.
 *
 * This code is the exclusive property of Anthaathi Private Limited and is protected by copyright and intellectual property laws.
 * Any unauthorized use, reproduction, distribution, or modification of this code is strictly prohibited.
 *
 * Anthaathi Private Limited reserves all rights in and to this code and will vigorously defend its intellectual property rights.
 */

import { ReactNode } from 'react';

export type FacetProperties =
	| DateTimeFacetSchema
	| AssignUserFacetSchema
	| EstimateFacetSchema
	| SelectFacetSchema
	| TimeFacetSchema;

export interface FacetSchema {
	properties: {
		[key: string]: FacetProperties & { type: string; title: ReactNode };
	};
}

export interface DateTimeFacetSchema {
	type: 'date-time';
	minDate?: string;
	maxDate?: string;
	title: string;
	defaultDate?: 'now' | number | Date;
}

export interface AssignUserFacetSchema {
	type: 'assign-user';
	title: string;
	isMulti?: boolean;
}

export interface EstimateFacetSchema {
	type: 'estimate';
	title: string;
}

export interface TimeFacetSchema {
	type: 'time';
}

export interface SelectFacetSchema {
	type: 'select';
	isMulti?: boolean;
	enum: { id: string; [key: string]: any }[];
}
