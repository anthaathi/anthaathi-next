import { styled, useStyletron } from 'baseui';
import { Block } from 'baseui/block';
import { Checkbox } from 'baseui/checkbox';
import React, { useMemo, useState } from 'react';
import { useDatatableConfig } from '../context/use-datatable-context';
import { FormSchema } from '../../FormBuilder/types';
import { LabelMedium, LabelXSmall } from 'baseui/typography';
import FormBuilder from '../../FormBuilder';
import { Button, KIND, SIZE } from 'baseui/button';
import { ArrowDown, ArrowUp } from '@carbon/icons-react';

export interface SplitColumnWidthAndDisplayOrderProps {
	schema: FormSchema;
}

export function SplitColumnWidthAndDisplayOrder(
	props: SplitColumnWidthAndDisplayOrderProps
) {
	const { config, setConfig } = useDatatableConfig();
	const [selectedItem, setSelectedItem] = useState<string | null>(null);
	const [css, $theme] = useStyletron();

	const items = useMemo(() => {
		const result = Object.keys(props.schema.properties)
			.map((key, index) => ({
				label: props.schema.properties[key].title,
				id: key,
				key: key,
				index: config.columnConfig[key]?.index ?? index,
				checked: config.columnConfig[key]?.visible ?? true,
			}))
			.sort((res1, res2) => res2.index - res1.index);

		return result.sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
	}, [config.columnConfig, props.schema.properties]);

	const [, setSelectedIndex] = useState<number | null>(0);

	return (
		<div className={css({ display: 'flex', minWidth: '620px' })}>
			<Block
				width="50%"
				$style={{
					borderRightStyle: 'solid',
					borderRightWidth: '1px',
					borderRightColor: '#D9d9d9',
				}}
			>
				<ListContainer
					$style={{
						paddingLeft: $theme.sizing.scale600,
					}}
				>
					{items.map((item, index) => (
						<ListItemContainer
							key={item.id}
							$isDragging={item.id === selectedItem}
							onClick={() => {
								setSelectedItem(item.id);
								setSelectedIndex(index);
							}}
						>
							<span className={css({ padding: $theme.sizing.scale400 })}>
								<Checkbox
									onChange={() => {
										setConfig({
											...config,
											columnConfig: {
												...config.columnConfig,
												[item.id]: {
													...config.columnConfig[item.id],
													visible: !item.checked,
												},
											},
										});
									}}
									checked={item.checked}
								/>
							</span>
							<LabelMedium>{item.label}</LabelMedium>
						</ListItemContainer>
					))}
				</ListContainer>

				<div
					className={css({
						display: 'flex',
						justifyContent: 'flex-end',
						borderTopStyle: 'solid',
						borderTopWidth: '1px',
						borderTopColor: '#D9d9d9',
						paddingTop: $theme.sizing.scale400,
						paddingBottom: $theme.sizing.scale400,
						paddingRight: $theme.sizing.scale400,
					})}
				>
					<Button size={SIZE.compact} kind={KIND.secondary}>
						<ArrowUp />
					</Button>
					<span className={css({ width: '6px' })} />
					<Button size={SIZE.compact} kind={KIND.secondary}>
						<ArrowDown />
					</Button>
				</div>
			</Block>
			{selectedItem && (
				<Block width="50%" padding="scale600">
					<Block marginBottom="scale300">
						<LabelXSmall $style={{ fontWeight: 600 }}>Column</LabelXSmall>
						<LabelMedium>
							{props.schema.properties[selectedItem]?.title}
						</LabelMedium>
					</Block>
					<FormBuilder
						onSubmit={(data) => {}}
						onChange={(data) => {
							setConfig({
								...config,
								columnConfig: {
									...config.columnConfig,
									[selectedItem]: {
										...config.columnConfig[selectedItem],
										width: data.width,
									},
								},
							});
						}}
						schema={{
							properties: {
								width: {
									type: 'number',
									title: 'Width',
									description: 'Minimum Column Width (Pixel)',
									name: 'width',
									colSpan: 12,
								},
							},
							required: [],
						}}
					/>
				</Block>
			)}
		</div>
	);
}

const ListContainer = styled('div', {
	display: 'flex',
	flexDirection: 'column',
});

const ListItemContainer = styled<'div', { $isDragging: boolean }>(
	'div',
	({ $isDragging }) => ({
		display: 'flex',
		alignItems: 'center',
		cursor: 'pointer',
		backgroundColor: $isDragging ? '#eee' : 'transparent',
		':hover': {
			backgroundColor: '#eee',
		},
	})
);
