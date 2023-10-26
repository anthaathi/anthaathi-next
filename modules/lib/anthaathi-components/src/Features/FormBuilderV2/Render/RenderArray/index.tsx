import { FileUploadType, JSONArray, JSONSchema } from '../../type';
import { Cell, Grid } from 'baseui/layout-grid';
import { FormControl } from 'baseui/form-control';
import React, {
	Fragment,
	useCallback,
	useContext,
	useEffect,
	useId,
} from 'react';
import { Select } from 'baseui/select';
import { useFormValue } from '../../Hooks/use-form-value';
import { useDatasourceValues } from '../../Hooks/use-datasource-values';
import { RenderNumber } from '../RenderNumber';
import { Button } from 'baseui/button';
import { RenderObject } from '../RenderObject';
import { getDefaultObject } from '../../getDefaultObject';
import { useStyletron } from 'baseui';
import { LabelMedium } from 'baseui/typography';
import { FormLabel } from '../../Components/FormLabel';
import { Close } from '@carbon/icons-react';
import { FormSizeContext } from '../../Context/FormSize';

export interface RenderArrayProps {
	field: JSONArray;
	rootSchema: JSONSchema;
	required?: boolean;
	path: string;
	onFileUpload?: FileUploadType;
	isLoading: boolean;
}

export function RenderArray(props: RenderArrayProps) {
	const fieldId = useId();
	const [value, setValue] = useFormValue(props.path);
	const [options, isLoading, refetch] = useDatasourceValues(
		props.field.dataSource,
	);

	useEffect(() => {
		refetch('', value);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const [css] = useStyletron();

	const id = useId();

	const onAdd = useCallback(() => {
		setValue((value) => {
			const concat = Array.from(value || []).concat(
				getDefaultObject(props.field.items, props.rootSchema),
			);

			setTimeout(() => {
				const elementById =
					document.getElementById(`${id}-${concat.length - 1}`)
						?.nextElementSibling ?? null;

				if (elementById === null) {
					return;
				}

				let allElements: NodeListOf<HTMLDivElement> =
					elementById.querySelectorAll(
						'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
					);
				let firstFocusableElement: HTMLDivElement | null = null;

				for (let elem of allElements) {
					if (elem.offsetWidth > 0 || elem.offsetHeight > 0) {
						firstFocusableElement = elem;
						break;
					}
				}

				if (firstFocusableElement) {
					firstFocusableElement.focus();
				}
			}, 10);

			return concat;
		});
	}, [id, props.field.items, props.rootSchema, setValue]);

	const size = useContext(FormSizeContext);

	const onRemove = useCallback(
		(index: number) => {
			setValue((value) => {
				const newValue = [...value];
				newValue.splice(index, 1);
				return newValue;
			});
		},
		[setValue],
	);

	switch (props.field.format) {
		case 'select':
		case 'search':
			return (
				<Cell {...(props.field.cellProps ?? { span: 12 })}>
					<FormControl
						label={
							<FormLabel title={props.field.title} required={props.required} />
						}
						overrides={
							size === 'compact' || size === 'mini'
								? {
										LabelContainer: {
											style: {
												marginTop: '0px',
												marginBottom: '6px',
											},
										},
								  }
								: {}
						}
						htmlFor={fieldId}
					>
						<Select
							size={size}
							isLoading={isLoading}
							id={fieldId}
							value={value ?? []}
							type={props.field.format}
							options={options}
							required={props.required}
							onInputChange={(e) => {
								refetch(e.target.value, value);
							}}
							filterOutSelected={props.field.dataSource?.type === 'static'}
							onChange={(e) => {
								setValue(
									e.value?.map((res) => ({ id: res.id, label: res.label })),
								);
							}}
							{...(props.field.dataSource?.type === 'dynamic'
								? {
										filterOptions: (options) => {
											return options;
										},
								  }
								: {})}
							overrides={{
								Input: {
									props: {
										autoComplete: 'off',
									},
								},
							}}
							disabled={props.field.disabled}
							placeholder={props.field.title}
							multi={(props.field.maxItems ?? undefined) !== 1}
							creatable={props.field.creatable}
						/>
					</FormControl>
				</Cell>
			);
		case 'range':
			return <RenderNumber {...props} />;

		default:
		case 'panel':
			return (
				<Cell {...(props.field.cellProps ?? { span: 12 })}>
					<Grid
						gridMaxWidth={0}
						gridMargins={0}
						overrides={{ Grid: { style: { marginTop: '12px' } } }}
					>
						{value?.map((res, index) => {
							return (
								<Fragment key={index}>
									<Cell
										span={12}
										overrides={{
											Cell: {
												props: {
													id: `${id}-${index}`,
												},
											},
										}}
									>
										<div
											className={css({ display: 'flex', alignItems: 'center' })}
										>
											<LabelMedium marginTop={0} marginBottom={0}>
												{props.field.title}
											</LabelMedium>
											<span className={css({ flexGrow: 1 })} />
											<Button
												size="compact"
												kind="secondary"
												type="button"
												onClick={() => onRemove(index)}
											>
												<Close />
											</Button>
										</div>
									</Cell>

									<RenderObject
										isLoading={props.isLoading}
										onFileUpload={props.onFileUpload}
										path={props.path + '/' + index}
										rootSchema={props.rootSchema}
										field={props.field.items}
									/>
								</Fragment>
							);
						})}
					</Grid>

					<Button
						type="button"
						onClick={onAdd}
						kind="tertiary"
						size="compact"
						overrides={{ Root: { style: { marginBottom: '12px' } } }}
					>
						{props.field.labels?.add ?? 'Add new ' + props.field.title}
					</Button>
				</Cell>
			);
	}
}
