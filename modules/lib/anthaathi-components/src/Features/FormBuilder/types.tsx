import * as Yup from 'yup';
import { Responsive } from 'baseui/layout-grid/types';
import { AdditionalOperation, RulesLogic } from 'json-logic-js';
import { Color } from 'baseui/badge/types';

export interface SectionField {
	name: string;
	type: 'section';
	title: string;
	description?: string;
}

export interface StringField {
	name: string;
	type: 'string';
	title: string;
	description?: string;
	defaultValue?: string;
	format?:
		| 'email'
		| 'password'
		| 'date-time'
		| 'time'
		| 'radio'
		| 'tag'
		| 'markdown'
		| 'text';
	dateFormat?: Intl.DateTimeFormatOptions;
	defaultTagColor?: Color;
	tagColorColumn?: string;
}

export interface ObjectField {
	name: string;
	type: 'object';
}

export interface NumberField {
	name: string;
	type: 'number' | 'integer';
	title: string;
	description?: string;
	defaultValue?: number;
	format?: 'currency';
	currencyField?: string;
}

export interface BooleanField {
	name: string;
	type: 'boolean';
	title: string;
	description?: string;
	defaultValue?: boolean;
	format: 'checkbox' | 'switch' | 'radio';
}

export interface SubmitFormButton {
	name: string;
	type: 'submit';
	title: string;
	description?: string;
	colSpan?: Responsive<number>;
}

export interface ArrayFieldDefault {
	name: string;
	type: 'array';
	title: string;
	description?: string;
	format: 'select';
	dataSource: 'static' | 'dynamic';
	isMulti?: boolean;
	creatable?: boolean;
	valueKey?: string;
	labelKey?: string;
	enum?: any[];
}

export interface ArrayDynamicField {
	dataSource: 'dynamic';
	dataSourceKey: string;
	dependsOn?: string[];
}

export interface ArrayStaticField {
	dataSource: 'static';
	enum?: {
		label: string;
		id: string;
	}[];
}

export interface HiddenField {
	name: string;
	type: 'hidden';
	title: string;
	description?: string;
}

export interface Divider {
	name: string;
	type: 'divider';
}

export interface DefaultField {
	name: string;
	description?: string;
	type: string;
	format?: string;
	title: string;
	inputProps?: object;
	enum?: string[];
	validation?: Yup.Schema;
	colSpan?: Responsive<number>;
	defaultValue?: any;
	condition?: RulesLogic<AdditionalOperation>;
	sortable?: boolean;
	filterable?: boolean;
}

export type LinkField = DefaultField & {
	type: 'link';
};

export type ArrayField = (ArrayDynamicField | ArrayStaticField) &
	ArrayFieldDefault;

export type FormField = (
	| SectionField
	| StringField
	| NumberField
	| BooleanField
	| ArrayField
	| ObjectField
	| SubmitFormButton
	| LinkField
	| HiddenField
	| Divider
) &
	DefaultField;

export interface FormSchema {
	properties: { [key: string]: FormField };
	required?: string[];
}

export interface FormData {
	[key: string]: any;
}

export interface FormErrors {
	[key: string]: string;
}
