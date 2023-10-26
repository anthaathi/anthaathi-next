/*
 * Copyright (c) Anthaathi Private Limited 2022.
 *
 * This code is the exclusive property of Anthaathi Private Limited and is protected by copyright and intellectual property laws.
 * Any unauthorized use, reproduction, distribution, or modification of this code is strictly prohibited.
 *
 * Anthaathi Private Limited reserves all rights in and to this code and will vigorously defend its intellectual property rights.
 */

import { ParagraphXSmall } from 'baseui/typography';
import {
	FacetProperties,
	FacetSchema,
	SelectFacetSchema,
} from '../type/FacetSchema';
import { useStyletron } from 'baseui';
import { Key, useEffect, useRef, useState } from 'react';
import { Pin } from '@carbon/icons-react';
import { Button, KIND, SHAPE, SIZE } from 'baseui/button';
import { useIntl } from 'react-intl';
import { Datepicker, DatePicker } from 'baseui/datepicker';
import AvatarStack from '../../AvatarStack';
import { Input } from 'baseui/input';
import { Badge } from 'baseui/badge';
import { Select } from 'baseui/select';
import { CardContent, CardDivider, CardTitle } from '../../DetailViewer';

export interface RenderFieldForViewingProps {
	field: FacetProperties;
	value: any;
}

function CommonFieldValueRenderer(props: {
	onClick: VoidFunction;
	value: any;
	size: 'mini' | 'default' | 'compact';
}) {
	const intl = useIntl();
	const [css, $theme] = useStyletron();

	return (
		<div
			tabIndex={0}
			onKeyUp={(e) => {
				if (e.key === 'Enter') {
					props?.onClick();
				} else if (e.keyCode === 13) {
					props?.onClick();
				}
			}}
			onClick={() => {
				props?.onClick();
			}}
			className={css({
				padding: props.size === 'compact' ? '4px' : '4px 6px',
				borderRadius: '4px',
				width:
					props.size === 'compact' ? 'calc(100% - 8px)' : 'calc(100% - 24px)',
				minHeight: props.size === 'compact' ? '22px' : '40px',
				cursor: 'pointer',
				...(props.size === 'compact'
					? $theme.typography.LabelXSmall
					: $theme.typography.LabelMedium),
				fontWeight: 300,
				display: 'flex',
				alignItems: 'center',
				userSelect: 'none',
				':hover': {
					backgroundColor: $theme.colors.backgroundSecondary,
				},
			})}
			role="button"
		>
			{props.value ?? intl.formatMessage({ defaultMessage: 'None' })}
		</div>
	);
}

function RenderFacetFieldDateTime(props: RenderFacetFieldEditingProps) {
	const [isOpen, setIsOpen] = useState(false);

	const dateRef = useRef<Datepicker<Date>>(null);

	useEffect(() => {
		if (isOpen) {
			dateRef.current?.open();
		}
	}, [isOpen]);

	return (
		<>
			{!isOpen && (
				<CommonFieldValueRenderer
					{...props}
					value={props.value}
					onClick={() => {
						setIsOpen(true);
					}}
				/>
			)}

			{isOpen && (
				<DatePicker
					size={props.size}
					onChange={() => {
						setTimeout(() => {
							if (!dateRef.current?.state.isOpen) {
								setIsOpen(false);
							}
						}, 0);
					}}
					onClose={() => {
						setIsOpen(false);
					}}
					ref={dateRef}
				/>
			)}
		</>
	);
}

function RenderFacetFieldTime(props: RenderFacetFieldEditingProps) {
	const [css] = useStyletron();
	const [isOpen, setIsOpen] = useState(false);

	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (isOpen) {
			inputRef.current?.focus();
		}
	}, [isOpen]);

	return (
		<div className={css({ width: '100%' })}>
			{!isOpen && (
				<>
					<CommonFieldValueRenderer
						{...props}
						onClick={() => setIsOpen(true)}
						value={<Badge shape={SHAPE.pill} content={props.value ?? '0m'} />}
					/>
				</>
			)}
			{isOpen && (
				<Input
					inputRef={inputRef}
					onBlur={() => setIsOpen(false)}
					size={props.size}
				/>
			)}
		</div>
	);
}

function RenderFacetField(
	props: RenderFieldForViewingProps & RenderFacetFieldEditingProps
) {
	switch (props.field.type) {
		case 'date-time':
			return (
				<RenderFacetFieldDateTime
					size={props.size}
					value={props.value}
					field={props.field}
					onSet={() => {}}
				/>
			);

		case 'assign-user':
			return (
				<AvatarStack
					items={[
						{
							title: 'Omkar Yadav',
							key: '12',
						},
					]}
					align="start"
					canAssign={true}
				/>
			);

		case 'time':
			return (
				<RenderFacetFieldTime
					size={props.size}
					value={props.value}
					field={props.field}
					onSet={() => {}}
				/>
			);

		case 'select':
			return <RenderFacetFieldSelect {...props} />;

		case 'estimate':
			return <RenderFacetFieldEstimate {...props} />;
	}

	return <></>;
}

function RenderFacetFieldSelect(props: RenderFacetFieldEditingProps) {
	const [css] = useStyletron();
	const [isOpen, setIsOpen] = useState(false);
	const [selectedOption, setSelectedOption] = useState(props.value);

	const options =
		(props.field as SelectFacetSchema).enum?.map((option) => ({
			id: option.id,
			label: option.name,
		})) ?? [];

	const ref = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (isOpen) {
			ref.current?.focus();
		}
	}, [isOpen]);

	return (
		<div className={css({ width: '100%' })}>
			{!isOpen && (
				<>
					<CommonFieldValueRenderer
						{...props}
						onClick={() => setIsOpen(true)}
						value={
							selectedOption ? (
								<Badge shape={SHAPE.pill} content={selectedOption.label} />
							) : (
								'None'
							)
						}
					/>
				</>
			)}
			{isOpen && (
				<Select
					inputRef={ref}
					options={options}
					value={selectedOption}
					onChange={({ value }) => setSelectedOption(value)}
					onBlur={() => setIsOpen(false)}
					size={props.size}
				/>
			)}
		</div>
	);
}

function RenderFacetFieldEstimate(props) {
	const [css] = useStyletron();
	const [isOpen, setIsOpen] = useState(false);

	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (isOpen) {
			inputRef.current?.focus();
		}
	}, [isOpen]);

	return (
		<div className={css({ width: '100%' })}>
			{!isOpen && (
				<>
					<CommonFieldValueRenderer
						{...props}
						onClick={() => setIsOpen(true)}
						value={<Badge shape={SHAPE.pill} content={props.value ?? '?'} />}
					/>
				</>
			)}
			{isOpen && (
				<Input
					inputRef={inputRef}
					onBlur={() => setIsOpen(false)}
					size={SIZE.mini}
				/>
			)}
		</div>
	);
}

export interface RenderFacetFieldEditingProps {
	onSet: () => void;
	field: FacetProperties;
	value: any;
	size: 'mini' | 'default' | 'compact';
}

export interface RenderFacetBuilderProps {
	schema: FacetSchema;
	data: Record<string, any>;
	size?: 'large' | 'default';
}

export function RenderFacetBuilder(props: RenderFacetBuilderProps) {
	switch (props.size) {
		case 'large':
			return <RenderFacetBuilderLarge {...props} />;
		default:
			return <RenderFacetBuilderDefault {...props} />;
	}
}

function RenderFacetBuilderLarge(props: RenderFacetBuilderProps) {
	const entries = Object.entries(props.schema.properties);
	return (
		<>
			{entries.map(([fieldName, field], index) => {
				return (
					<>
						<CardTitle>{field.title}</CardTitle>
						<CardContent>
							<RenderFacetField
								size={SIZE.default}
								field={field}
								onSet={() => {}}
								value={props.data[fieldName]}
							/>
						</CardContent>
						{index !== entries.length - 1 && <CardDivider />}
					</>
				);
			})}
		</>
	);
}

function RenderFacetBuilderDefault(props: RenderFacetBuilderProps) {
	const [css, $theme] = useStyletron();
	const [hovering, setHovering] = useState<Key | null>(null);

	return (
		<ul
			className={css({
				marginLeft: 0,
				marginRight: 0,
				listStyleType: 'none',
				paddingLeft: 0,
				paddingTop: 0,
				paddingRight: 0,
				marginTop: 0,
				marginBottom: 0,
			})}
		>
			{Object.entries(props.schema.properties).map(([fieldName, field]) => {
				return (
					<li
						key={fieldName}
						className={css({
							display: 'flex',
							paddingBottom: $theme.sizing.scale0,
						})}
					>
						<ParagraphXSmall
							marginTop={0}
							marginBottom={0}
							padding="4px"
							display="flex"
							alignItems="center"
							$style={{ width: '35%' }}
							onMouseOver={() => {
								setHovering(fieldName);
							}}
							onMouseOut={() => {
								setHovering(null);
							}}
						>
							{field.title}
							&nbsp; &nbsp;
							<Button
								size={SIZE.mini}
								shape={SHAPE.pill}
								kind={KIND.tertiary}
								overrides={{
									Root: {
										style: {
											visibility: hovering === fieldName ? 'inherit' : 'hidden',
										},
									},
								}}
							>
								<Pin size={16} />
							</Button>
						</ParagraphXSmall>
						<div
							className={css({
								width: '65%',
								display: 'flex',
								alignItems: 'center',
							})}
						>
							<RenderFacetField
								size={SIZE.compact}
								field={field}
								onSet={() => {}}
								value={props.data[fieldName]}
							/>
						</div>
					</li>
				);
			})}
		</ul>
	);
}
