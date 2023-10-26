export type DataSource = DataSourceDynamic | DataSourceStatic;

export interface StaticEnum {
	label: string;
	id: string;
	disabled?: boolean;
	description?: string;
	image?: string;
}

export interface DataSourceStatic {
	type: 'static';

	values: StaticEnum[];
}

export interface DataSourceDynamic {
	type: 'dynamic';
	name: string;
}
