import { NestedMenus, StatefulMenu } from 'baseui/menu';
import * as React from 'react';
import { useMemo } from 'react';
import { useStyletron } from 'baseui';
import { ChevronRight } from '@carbon/icons-react';
import { Radio } from 'baseui/radio';

export type Items = ReadonlyArray<Item>;

export type Item = ItemWithSubMenu | Divider;

export type ItemWithSubMenu = {
	key?: string;
	label: string;
	data: string | string[];
	icon?: React.ReactNode;
	config?: {
		type?: 'radio' | 'checkbox';
	};
	selected?: boolean;
	subMenu?: Items;
};

export type Divider = { divider: boolean };

export function NestedMenu({
	items,
	hasParent,
	onClose,
	onItemSelect,
}: {
	items: Items;
	hasParent?: boolean;
	onClose?: () => void;
	onItemSelect: (item: Items) => void;
}) {
	const Comp = hasParent ? React.Fragment : NestedMenus;
	const [css] = useStyletron();

	const newItems = useMemo(() => {
		if (!Array.isArray(items)) {
			return items;
		}

		const doesHaveSelect =
			items.findIndex(
				(res) => 'selected' in res && typeof res.selected !== 'undefined',
			) !== -1;

		const doesHaveIcon =
			items.findIndex(
				(res) => 'icon' in res && typeof res.icon !== 'undefined',
			) !== -1;

		return items.map((item: Item, index) => {
			if ('divider' in item && item.divider) {
				return item;
			}

			const res = item as ItemWithSubMenu;

			return {
				...res,
				rawLabel: res.label,
				label: (
					<React.Fragment key={res.key || res.label || index}>
						{doesHaveSelect && (
							<>
								<Radio
									checked={res.selected}
									overrides={{
										Root: {
											style: {
												marginTop: 0,
												marginBottom: 0,
											},
										},
										Input: {
											style: {
												width: '8px',
											},
										},
									}}
								/>
								<span className={css({ width: '12px' })}></span>
							</>
						)}
						{doesHaveIcon && (
							<span
								className={css({
									marginRight: '12px',
									display: 'flex',
									alignItems: 'center',
									minWidth: '16px',
								})}
							>
								{res.icon}
							</span>
						)}
						{res.label}
						{res.subMenu && (
							<>
								<span className={css({ flexGrow: 1 })}></span>
								<ChevronRight size={12 as never} />
							</>
						)}
					</React.Fragment>
				),
			};
		});
	}, [css, items]);

	return (
		<Comp>
			<StatefulMenu
				items={newItems}
				onItemSelect={({ item, event }) => {
					onItemSelect?.(item);
					if (!Array.isArray(item?.subMenu)) {
						onClose?.();
					}
				}}
				overrides={{
					List: { style: { width: '190px', overflow: 'auto' } },
					ListItem: {
						style: {
							display: 'flex',
							alignItems: 'center',
						},
					},
					Option: {
						props: {
							getItemLabel: (item: { label: string }) => item.label,
							size: 'compact',
							getChildMenu: (item: {
								label: string;
								key?: string;
								rawLabel: string;
							}) => {
								if (Array.isArray(items)) {
									const itemForSubItem = (items as ItemWithSubMenu[]).find(
										(res) =>
											(!item.key &&
												// @ts-ignore
												(res.rawLabel || res.label) ===
													(item.rawLabel ?? item.label)) ||
											(item.key && item.key === res.key),
									);

									if (!itemForSubItem) {
										return null;
									}

									if (!Array.isArray(itemForSubItem.subMenu)) {
										return null;
									}

									return (
										<NestedMenu
											onClose={onClose}
											items={itemForSubItem.subMenu || []}
											hasParent={true}
											onItemSelect={onItemSelect}
										/>
									);
								}

								return null;
							},
						},
					},
				}}
			/>
		</Comp>
	);
}
