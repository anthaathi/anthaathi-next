import { DataSource } from './DataSource';
import { CellProps } from 'baseui/layout-grid';
import { AdditionalOperation, RulesLogic } from 'json-logic-js';
import { Uppy } from '@uppy/core';

type Unboxed<T> = T extends (infer U)[] ? U : T;

export type AnyJSONSchema = JSONSchema;

export type JSONSchema<T = any> =
	| JSONObject<T>
	| JSONString
	| JSONNumber
	| JSONArray<T>
	| JSONBoolean
	| JSONAllOff
	| JSONAnyOff
	| JSONOneOf
	| JSONNot
	| JSONConst
	| JSONRef;

export type JSONSchemaWithoutRef =
	| JSONObject
	| JSONString
	| JSONNumber
	| JSONArray
	| JSONBoolean
	| JSONAllOff
	| JSONAnyOff
	| JSONOneOf
	| JSONNot
	| JSONConst;

export interface JSONConst {
	const: string | number;
	title?: string;
}

export interface JSONRef {
	$ref: string;
}

export interface JSONAllOff {
	allOf: JSONObject[];
}

export interface JSONAnyOff {
	anyOf: JSONObject[];
}

export interface JSONOneOf {
	oneOf: JSONSchema[];
}

export interface JSONNot {
	not: JSONObject;
}

export interface JSONObject<T = any> {
	type: 'object';
	properties: {
		[K in keyof T]?: JSONSchema<T[K]>;
	};
	required?: (keyof T)[];
	format?: 'tel';
	title?: string;
	cellProps?: CellProps;
	expandable?: boolean;
	initialExpanded?: boolean;
	condition?: RulesLogic<AdditionalOperation>;
	$defs?: Record<string, JSONSchema>;
	collapsedItems?: string[];
}

export interface JSONString {
	type: 'string';
	title: string;
	disabled?: boolean;
	description?: string;
	caption?: string;
	formatMinimum?: string;
	accept?: string | string[];
	formatMaximum?: string;
	autoFocus?: boolean;
	default?: string;
	align?:
		| 'space-around'
		| 'space-between'
		| 'space-evenly'
		| 'stretch'
		| 'center'
		| 'flex-start'
		| 'flex-end';
	format?:
		| 'email'
		| 'text'
		| 'radio'
		| 'date'
		| 'time'
		| 'password'
		| 'textarea'
		| 'json'
		| 'file'
		| 'color'
		| 'url'
		| 'select'
		| 'markdown'
		| 'submit'
		| 'hidden'
		| 'search'
		| 'card'
		| 'date-time';
	pattern?: string;
	prefix?: string;
	suffix?: string;
	dateFormat?: string;
	minLength?: number;
	maxLength?: number;
	dataSource?: DataSource;
	refetchOn?: { type: 'change'; fields: string[] }[];
	cellProps?: CellProps;
	viewCellProps?: CellProps;
	condition?: RulesLogic<AdditionalOperation>;
}

export interface JSONNumber {
	viewCellProps?: CellProps;
	type: 'number';
	title: string;
	description?: string;
	minimum?: number;
	maximum?: number;
	step?: number;
	cellProps?: CellProps;
	default?: number;
	format?: 'input' | 'range';
	condition?: RulesLogic<AdditionalOperation>;
}

export interface JSONArray<T = any> {
	viewCellProps?: CellProps;
	type: 'array';
	items: JSONSchema<Unboxed<T>>;
	minItems?: number;
	maxItems?: number;
	format?: 'select' | 'search' | 'range' | 'panel' | 'file';
	cellProps?: CellProps;
	title: string;
	dataSource?: DataSource;
	emptyMessage?: string;
	default?: any[];
	disabled?: boolean;
	creatable?: boolean;
	minimum?: number;
	maximum?: number;
	step?: number;
	labels?: {
		add?: string;
		remove?: string;
	};
	condition?: RulesLogic<AdditionalOperation>;
}

export interface JSONBoolean {
	viewCellProps?: CellProps;
	title: string;
	description?: string;
	type: 'boolean';
	cellProps?: CellProps;
	format?: 'switch' | 'checkbox';
	default?: boolean;
	condition?: RulesLogic<AdditionalOperation>;
}

export type FileUploadType = Uppy;
