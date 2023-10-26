import {
	JSONArray,
	JSONBoolean,
	JSONNumber,
	JSONObject,
	JSONSchema,
	JSONString,
} from '../FormBuilderV2/type';
import { Cell, CellProps, Grid } from 'baseui/layout-grid';
import { useStyletron } from 'baseui';
import { LabelMedium, LabelSmall } from 'baseui/typography';
import React, { useMemo } from 'react';
import { Block } from 'baseui/block';
import { StyledLink } from 'baseui/link';
import { MarkdownViewer } from '../MarkdownEditor';
import { FormattedMessage, useIntl } from 'react-intl';
import { Badge } from 'baseui/badge';
import { Button } from 'baseui/button';
import { ArrowDown, ArrowUp } from '@carbon/icons-react';
import { Accordion, Panel } from 'baseui/accordion';

export interface FormDataViewerProps<T> {
	schema: JSONSchema<T>;
	pinnedCols?: string[];
	data: T;
}

export function FormDataViewer<T = any>(props: FormDataViewerProps<T>) {
	const [isShowMore, setIsShowMore] = React.useState(false);

	const schema = useMemo(() => {
		if (!props.schema) {
			throw new Error('No schema is passed');
		}

		if (
			!props.pinnedCols ||
			!('type' in props.schema) ||
			('type' in props.schema && props.schema.type !== 'object')
		) {
			return props.schema;
		}

		if (isShowMore) {
			return props.schema;
		}

		const properties: { [x: string]: JSONSchema<any> | undefined } =
			Object.entries(props.schema.properties).reduce((acc, [key, property]) => {
				if (!property) {
					return acc;
				}

				if (props.pinnedCols?.includes(key)) {
					// @ts-ignore
					acc[key] = property;
				}

				return acc;
			}, {} as { [x: string]: JSONSchema | undefined });

		return {
			...props.schema,
			properties,
		} as JSONSchema;
	}, [props, isShowMore]);

	return (
		<Block padding="scale650">
			<Grid gridMargins={0} gridMaxWidth={0}>
				<RenderField data={props.data} schema={schema} />
			</Grid>

			<Block marginBottom="scale200" />

			{props.pinnedCols && (
				<Block display="flex" alignContent="center" placeContent="center">
					<Button
						size="mini"
						kind="tertiary"
						overrides={{
							Root: {
								style: {
									width: '100%',
								},
							},
						}}
						onClick={() => {
							setIsShowMore(!isShowMore);
						}}
						startEnhancer={
							!isShowMore ? (
								<ArrowDown size={12 as never}></ArrowDown>
							) : (
								<ArrowUp size={12 as never} />
							)
						}
					>
						{!isShowMore ? (
							<FormattedMessage defaultMessage="Show more" />
						) : (
							<FormattedMessage defaultMessage="Show less" />
						)}
					</Button>
				</Block>
			)}
		</Block>
	);
}

function RenderObject(props: { schema: JSONObject; data: any }) {
	return (
		<>
			{Object.entries(props.schema.properties).map(([key, property]) => {
				if (!property) {
					return <></>;
				}

				return (
					<RenderField key={key} schema={property} data={props.data?.[key]} />
				);
			})}
		</>
	);
}

const DefaultCellProps: CellProps = {
	span: 12,
};

function RenderField(props: { schema: JSONSchema; data?: any }) {
	if (typeof props.schema !== 'object') {
		return <></>;
	}

	if (!('type' in props.schema)) {
		console.warn('Schema is not supported', props.schema);
		return <></>;
	}

	switch (props.schema.type) {
		case 'object':
			return <RenderObject schema={props.schema} data={props.data} />;
		case 'string':
			return (
				<Cell
					{...(props.schema.cellProps ??
						props.schema.viewCellProps ??
						DefaultCellProps)}
				>
					<RenderString data={props.data} schema={props.schema} />
				</Cell>
			);
		case 'number':
			return (
				<Cell
					{...(props.schema.cellProps ??
						props.schema.viewCellProps ??
						DefaultCellProps)}
				>
					<RenderNumber data={props.data} schema={props.schema} />
				</Cell>
			);
		case 'boolean':
			return (
				<Cell
					{...(props.schema.cellProps ??
						props.schema.viewCellProps ??
						DefaultCellProps)}
				>
					<RenderBoolean data={props.data} schema={props.schema} />
				</Cell>
			);
		case 'array':
			return (
				<Cell
					{...(props.schema.cellProps ??
						props.schema.viewCellProps ??
						DefaultCellProps)}
				>
					<RenderArray data={props.data} schema={props.schema} />
				</Cell>
			);
	}

	return <></>;
}

function RenderString(props: { schema: JSONString; data?: string }) {
	const [css, $theme] = useStyletron();

	const intl = useIntl();

	const data = useMemo(() => {
		switch (props.schema.format) {
			case 'date':
				return props.data ? intl.formatDate(new Date(props.data)) : null;
			case 'color':
				return (
					<div
						className={css({
							width: '100%',
							height: '100%',
							backgroundColor: props.data,
						})}
					/>
				);
			case 'file':
				return (
					<>
						{(Array.isArray(props.data) ? props.data : []).map((res) => {
							return (
								<StyledLink
									key={res.name}
									href={(res as Record<string, any>)?.url ?? '#'}
									download
								>
									{'name' in res && (res as Record<string, any>).name}
								</StyledLink>
							);
						})}
					</>
				);
			case 'url':
				return <StyledLink href={props.data} target="_blank" rel="noopner" />;

			case 'email':
				return (
					<StyledLink href={props.data ? 'mailto:' + props.data : '#'}>
						{props.data}
					</StyledLink>
				);
			case 'json':
				return (
					<pre
						className={css({
							whiteSpace: 'pre-wrap',
							wordBreak: 'break-word',
							paddingTop: 0,
							paddingBottom: 0,
							marginTop: 0,
							marginBottom: 0,
						})}
					>
						{JSON.stringify(props.data, null, 2)}
					</pre>
				);
			case 'textarea':
				return (
					<pre
						className={css({
							whiteSpace: 'pre-wrap',
							wordBreak: 'break-word',
							paddingTop: 0,
							paddingBottom: 0,
							marginTop: 0,
							marginBottom: 0,
						})}
					>
						{props.data || '-'}
					</pre>
				);
			case 'password':
				// TODO: MAKE TOGGLEABLE
				return (
					<pre
						className={css({
							whiteSpace: 'pre-wrap',
							wordBreak: 'break-word',
							paddingTop: 0,
							paddingBottom: 0,
							marginTop: 0,
							marginBottom: 0,
						})}
					>
						{props.data}
					</pre>
				);
			case 'markdown':
				return <MarkdownViewer value={props.data ?? ''} />;
			case 'select':
			case 'radio':
				// @ts-ignore
				return Array.isArray(props.data) ? props.data[0]?.label : props.data;
			case 'submit':
				return false;
			default:
				return typeof props.data === 'string' ? props.data : null;
		}
	}, [css, intl, props.data, props.schema]);

	if (data === false) {
		return <></>;
	}

	return (
		<div
			className={css({
				display: 'flex',
				flexDirection: 'column',
				marginBottom: $theme.sizing.scale200,
			})}
		>
			<LabelSmall
				color={$theme.colors.contentSecondary}
				marginBottom="scale200"
			>
				{props.schema.title}
			</LabelSmall>
			<LabelMedium>{data || '-'}</LabelMedium>
		</div>
	);
}

function RenderNumber(props: { schema: JSONNumber; data: number }) {
	const [css, $theme] = useStyletron();

	return (
		<div
			className={css({
				display: 'flex',
				flexDirection: 'column',
				marginBottom: $theme.sizing.scale200,
			})}
		>
			<LabelSmall
				color={$theme.colors.contentSecondary}
				marginBottom="scale200"
			>
				{props.schema.title}
			</LabelSmall>
			<LabelMedium>{props.data}</LabelMedium>
		</div>
	);
}

function RenderBoolean(props: { schema: JSONBoolean; data: boolean }) {
	const [css, $theme] = useStyletron();
	const intl = useIntl();

	return (
		<div
			className={css({
				display: 'flex',
				flexDirection: 'column',
				marginBottom: $theme.sizing.scale200,
			})}
		>
			<LabelSmall
				color={$theme.colors.contentSecondary}
				marginBottom="scale200"
			>
				{props.schema.title}
			</LabelSmall>
			<LabelMedium>
				{props.data
					? intl.formatMessage({ defaultMessage: 'Yes' })
					: intl.formatMessage({ defaultMessage: 'No' })}
			</LabelMedium>
		</div>
	);
}

function RenderArray(props: { schema: JSONArray; data: any[] }) {
	const [css, $theme] = useStyletron();

	const value = useMemo(() => {
		if (!Array.isArray(props.data)) {
			return <></>;
		}

		if (props.data.length === 0) {
			return (
				<Cell {...(props.schema.cellProps ?? DefaultCellProps)}>
					{props.schema.emptyMessage ?? '-'}
				</Cell>
			);
		}

		switch (props.schema.format) {
			case 'select':
				return props.data?.map((res, index) => (
					<Cell
						{...(props.schema.cellProps ?? DefaultCellProps)}
						key={(res as Record<string, any>).id + index}
					>
						<Badge content={(res as Record<string, any>).label} />
					</Cell>
				));

			case 'panel':
				return (
					<Accordion>
						{props.data.map((res, index) => {
							return (
								<Panel title={`${props.schema.title} - ${index + 1}`}>
									<RenderField
										data={res}
										// @ts-ignore
										key={index + res?.id}
										schema={props.schema.items}
									/>
								</Panel>
							);
						})}
					</Accordion>
				);

			default:
				return props.data.map((res, index) => {
					return (
						<RenderField
							data={res}
							// @ts-ignore
							key={index + res?.id}
							schema={props.schema.items}
						/>
					);
				});
		}
	}, [
		props.data,
		props.schema.cellProps,
		props.schema.emptyMessage,
		props.schema.format,
		props.schema.items,
		props.schema.title,
	]);

	return (
		<div
			className={css({
				display: 'flex',
				flexDirection: 'column',
				marginBottom: $theme.sizing.scale300,
			})}
		>
			<LabelSmall
				color={$theme.colors.contentSecondary}
				marginBottom="scale200"
			>
				{props.schema.title}
			</LabelSmall>
			<Block width="100%">
				<Grid gridMargins={0} gridMaxWidth={0}>
					{value}
				</Grid>
			</Block>
		</div>
	);
}
