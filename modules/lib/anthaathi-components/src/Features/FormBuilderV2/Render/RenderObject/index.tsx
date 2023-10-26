import {
	FileUploadType,
	JSONArray,
	JSONBoolean,
	JSONNumber,
	JSONObject,
	JSONSchema,
	JSONSchemaWithoutRef,
	JSONString,
} from '../../type';
import { RenderString } from '../RenderString';
import { RenderNumber } from '../RenderNumber';
import { RenderBoolean } from '../RenderBoolean';
import { RenderArray } from '../RenderArray';
import { PhoneNumber } from '../../Components/PhoneNumber';
import React, { useCallback, useContext, useMemo, useState } from 'react';
import { Cell, Grid } from 'baseui/layout-grid';
import { LabelMedium } from 'baseui/typography';
import { useStyletron } from 'baseui';
import { expandBorderStyles } from 'baseui/styles';
import { Button, SHAPE } from 'baseui/button';
import { CaretDown } from '@carbon/icons-react';
import { Block } from 'baseui/block';
import { apply } from 'json-logic-js';
import { FormBuilderContext } from '../../Context/FormBuilderState';
import { RenderOneOf } from '../../Components/RenderOneOf';

export interface RenderObjectProps {
	rootSchema: JSONSchema;
	field: JSONSchema;
	required?: boolean;
	path?: string;
	onFileUpload?: FileUploadType;
	isLoading: boolean;
}

function RenderObjectData(props: {
	field: JSONObject<any>;
	className: string;
	predicate: (res) => boolean;
	callbackfn: (key) => React.JSX.Element;
	onClick: () => void;
	collapsed: boolean;
}) {
	const [expanded, setIsExpanded] = useState(
		(props.field as JSONObject).initialExpanded ?? true,
	);
	const [css, $theme] = useStyletron();

	const commonStyle = css({
		display: 'flex',
		width: 'calc(100% + 24px)',
		marginLeft: '-12px',
		marginRight: '-12px',
		...expandBorderStyles($theme.borders.border100),
	});

	return (
		<>
			{props.field.title && (
				<Cell span={12}>
					<div
						onClick={() => {
							if ((props.field as JSONObject).expandable) {
								setIsExpanded((prev) => !prev);
							}
						}}
						className={props.className}
					>
						<div className={commonStyle} />
						<div className={css({ display: 'flex', alignItems: 'center' })}>
							{props.field.expandable && (
								<Button
									size="mini"
									shape={SHAPE.circle}
									kind="secondary"
									type="button"
									overrides={{
										Root: {
											style: {
												marginRight: $theme.sizing.scale500,
											},
										},
									}}
								>
									<CaretDown
										className={css(
											!expanded
												? {
														transform: 'rotate(-95deg)',
														transitionTimingFunction: 'ease',
														transitionDuration: '.3s',
														transitionProperty: 'transform',
												  }
												: {
														transitionTimingFunction: 'ease',
														transitionDuration: '.3s',
														transitionProperty: 'transform',
												  },
										)}
									/>
								</Button>
							)}

							<LabelMedium paddingTop="scale500" paddingBottom="scale500">
								{props.field.title}
							</LabelMedium>
						</div>
						<div className={commonStyle} />
					</div>
				</Cell>
			)}

			<Cell span={12}>
				<Block
					$style={
						(props.field as JSONObject).title
							? {
									paddingTop: 'scale500',
									paddingBottom: 'scale500',
									paddingLeft: 'scale300',
									paddingRight: 'scale300',
							  }
							: {}
					}
				>
					<Grid gridMargins={0} gridMaxWidth={0}>
						{expanded &&
							Object.keys(props.field.properties)
								.filter(props.predicate)
								.map(props.callbackfn)}
					</Grid>
					{((props.field as JSONObject).collapsedItems ?? []).length !== 0 && (
						<Button
							type="button"
							size="mini"
							kind="secondary"
							onClick={props.onClick}
							overrides={{
								Root: {
									style: {
										marginBottom: '12px',
									},
								},
							}}
						>
							{props.collapsed ? 'Collapse' : 'Expand'}
						</Button>
					)}
				</Block>
			</Cell>

			{props.field.title && expanded && (
				<Cell span={12}>
					<div
						className={css({
							display: 'flex',
							width: 'calc(100% + 24px)',
							marginLeft: '-12px',
							marginRight: '-12px',
							...expandBorderStyles($theme.borders.border100),
						})}
					/>
				</Cell>
			)}
		</>
	);
}

export function RenderObject(props: RenderObjectProps) {
	const [css] = useStyletron();
	const [state] = useContext(FormBuilderContext);
	const [isCollapsed, setIsCollapsed] = useState(false);

	const isAllowed = useMemo(() => {
		const jsonObj = props.field as JSONObject;

		if (!jsonObj.condition) {
			return true;
		}

		return apply(jsonObj.condition, state);
	}, [props.field, state]);

	const field: JSONSchemaWithoutRef | undefined =
		'$ref' in props.field
			? ((props.rootSchema as JSONObject).$defs?.[
					props.field.$ref.replace('#/definitions/', '')
			  ] as JSONSchemaWithoutRef)
			: props.field;

	const callbackFunction = useCallback(
		(key: string) => {
			return (
				<React.Fragment key={key}>
					{field && (
						<RenderObject
							isLoading={props.isLoading}
							onFileUpload={props.onFileUpload}
							path={(props.path ?? '') + '/' + key}
							required={
								((field as JSONObject).required || [])?.indexOf(key) !== -1
							}
							rootSchema={props.rootSchema}
							field={(field as JSONObject).properties[key]!}
						/>
					)}
				</React.Fragment>
			);
		},
		[field, props.isLoading, props.onFileUpload, props.path, props.rootSchema],
	);

	if (!field || !props.field || !isAllowed) {
		return null;
	}

	if ('const' in field) {
		// TODO: NEEDS TO FIX
		return null;
	}

	if ('allOf' in field) {
		return (
			<>
				{field.allOf.map((res, index) => {
					return (
						<React.Fragment key={index}>
							<RenderObject
								onFileUpload={props.onFileUpload}
								path={props.path ?? '/'}
								required={props.required}
								rootSchema={props.rootSchema}
								field={field}
								isLoading={props.isLoading}
							/>
						</React.Fragment>
					);
				})}
			</>
		);
	}

	if ('not' in field) {
		console.warn('Not is not supported in form only in validation');
		return null;
	}

	if ('anyOf' in field) {
		for (const subSchema of field.anyOf) {
			const isAllowed = apply(subSchema, state);
			if (isAllowed) {
				return (
					<RenderObject
						isLoading={props.isLoading}
						onFileUpload={props.onFileUpload}
						path={props.path ?? '/'}
						required={props.required}
						rootSchema={props.rootSchema}
						field={subSchema}
					/>
				);
			}
		}
		return null;
	}

	if ('oneOf' in field) {
		return (
			<RenderOneOf
				isLoading={props.isLoading}
				onFileUpload={props.onFileUpload}
				path={props.path ?? '/'}
				required={props.required}
				rootSchema={props.rootSchema}
				field={field}
			/>
		);
	}

	if ((field as JSONObject).type === 'object' && (field as JSONObject).format) {
		switch ((props.field as JSONObject).format) {
			case 'tel':
				return <PhoneNumber {...props} />;
		}
	}

	return (
		<>
			{field.type === 'object' && (
				<RenderObjectData
					field={field}
					className={css(field.expandable ? { cursor: 'pointer' } : {})}
					predicate={(res) => {
						if ((field.collapsedItems ?? []).length === 0) {
							return true;
						}

						if (isCollapsed) {
							return true;
						}

						return (
							(field.collapsedItems || []).findIndex((res1) => res1 === res) ===
							-1
						);
					}}
					callbackfn={callbackFunction}
					onClick={() => {
						setIsCollapsed((prev) => !prev);
					}}
					collapsed={isCollapsed}
				/>
			)}
			{field.type === 'string' && (
				<RenderString
					isLoading={props.isLoading}
					onFileUpload={props.onFileUpload}
					path={props.path ?? '/'}
					required={props.required}
					rootSchema={props.rootSchema}
					field={field as JSONString}
				/>
			)}
			{field.type === 'number' && (
				<RenderNumber
					required={props.required}
					rootSchema={props.rootSchema}
					path={props.path ?? '/'}
					field={field as JSONNumber}
				/>
			)}
			{field.type === 'boolean' && (
				<RenderBoolean
					required={props.required}
					path={props.path ?? '/'}
					field={field as JSONBoolean}
					rootSchema={props.rootSchema}
				/>
			)}
			{field.type === 'array' && (
				<RenderArray
					isLoading={props.isLoading}
					onFileUpload={props.onFileUpload}
					path={props.path ?? '/'}
					required={props.required}
					field={field as JSONArray}
					rootSchema={props.rootSchema}
				/>
			)}
		</>
	);
}
