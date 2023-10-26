import { ButtonGroup } from 'baseui/button-group';
import { Button } from 'baseui/button';
import React, { useMemo } from 'react';
import {
	DataTable as DataTableIcon,
	Thumbnail_2 as Thumbnail2,
} from '@carbon/icons-react';
import { DataTableView, useDataTableView } from '../../Context/DataTableView';

export const ButtonDataTableView: {
	key: DataTableView;
	icon: React.ReactElement;
}[] = [
	{
		key: 'card',
		icon: <Thumbnail2 />,
	},
	{	
		key: 'table',
		icon: <DataTableIcon />,
	},
];

export function DataTableViewToggle() {
	const [view, setView] = useDataTableView();
	const selectedIndex = useMemo(() => {
		return ButtonDataTableView.findIndex((res) => res.key === view);
	}, [view]);

	return (
		// @ts-ignore
		<ButtonGroup overrides={{
			Root:{
				style:{
					display:'flex',
					gap:'5px'
				}
			}
		}}
			size="compact"
			mode="radio"
			selected={selectedIndex}
			onClick={(e, index) => {
				const d = ButtonDataTableView[index];
				if (!d?.key) {
					return;
				}

				setView(d.key);
			}}
		>
			{ButtonDataTableView.map((view) => (
				<Button type="button" key={view.key}>
					{view.icon}
				</Button>
			))}
		</ButtonGroup>
	);
}
