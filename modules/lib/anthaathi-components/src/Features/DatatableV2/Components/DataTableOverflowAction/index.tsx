import { StatefulPopover } from 'baseui/popover';
import { StatefulMenu } from 'baseui/menu';
import { Button } from 'baseui/button';
import { OverflowMenuVertical } from '@carbon/icons-react';
import { DataTableAction, DataTableActionMethod } from '../../type';
import { useMemo } from 'react';

export interface DataTableOverflowActionProps<T> {
	actions?: DataTableAction[];
	onAction?: DataTableActionMethod<T>;
	row: T;
}

const style = {
	List: {
		style: {
			minWidth: 'max-content',
		},
	},
};

export function DataTableOverflowAction<T>(
	props: DataTableOverflowActionProps<T>
) {
	const items = useMemo(() => {
		return (
			props.actions?.map((res) => ({
				key: res.key,
				label: res.label,
			})) ?? []
		);
	}, [props.actions]);

	if (props.actions?.length === 1) {
		return (
			<Button
				size="compact"
				kind="tertiary"
				onClick={() => {
					props.onAction?.([props.row], props.actions?.[0]?.key!);
				}}
			>
				{props.actions[0].label}
			</Button>
		);
	}

	return (
		<StatefulPopover
			onClick={(e) => {
				e.stopPropagation();
			}}
			content={({ close }) => (
				<StatefulMenu
					onItemSelect={(item) => {
						props.onAction?.([props.row], item.item.key);
						close();
					}}
					overrides={style}
					items={items}
				/>
			)}
			placement="bottomRight"
		>
			<Button kind="tertiary" size="mini">
				<OverflowMenuVertical />
			</Button>
		</StatefulPopover>
	);
}
