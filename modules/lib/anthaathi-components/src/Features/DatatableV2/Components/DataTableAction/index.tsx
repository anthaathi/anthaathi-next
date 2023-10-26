import { Button } from 'baseui/button';
import { ChevronDown } from 'baseui/icon';
import { useIntl } from 'react-intl';
import { StatefulPopover } from 'baseui/popover';
import { Items, NestedMenu } from '../../../NestedMenu';
import { useMemo } from 'react';
import {
	CaretSort,
	Download,
	Filter,
	Help,
	PageBreak,
	Report,
	Reset,
	Save,
	SettingsView,
	Table,
	TableAlias,
} from '@carbon/icons-react';
import { JSONObject } from '../../../FormBuilderV2/type';
import { useDataTableState } from '../../Context/DataTableStateContext';
import { DatatableState } from '../../type';

export function DataTableAction(props: {
	schema?: JSONObject;
	onAction?: (data: string[] | string) => void;
}) {
	const intl = useIntl();

	const [data, setState] = useDataTableState();

	const pageSize = data?.pagination?.pageSize ?? 50;

	const items = useMemo<Items>(() => {
		return [
			props.schema && {
				label: intl.formatMessage({ defaultMessage: 'Save' }),
				icon: <Save />,
				data: 'save',
			},
			props.schema && {
				divider: true,
				key: 'index',
			},
			props.schema && {
				icon: <Filter />,
				label: intl.formatMessage({ defaultMessage: 'Filter' }),
				data: 'filter',
			},
			props.schema && {
				icon: <Table />,
				data: 'data',
				label: intl.formatMessage({ defaultMessage: 'Data' }),
				subMenu: [
					{
						icon: <CaretSort />,
						label: intl.formatMessage({ defaultMessage: 'Sort' }),
						data: 'sort',
					},
				],
			},
			props.schema && {
				data: 'format',
				label: intl.formatMessage({ defaultMessage: 'Format' }),
				icon: <SettingsView />,
				subMenu: [
					{
						label: intl.formatMessage({ defaultMessage: 'Control Break' }),
						icon: <PageBreak />,
						data: 'control-break',
					},
					{
						icon: <Table />,
						label: intl.formatMessage({ defaultMessage: 'Row per page' }),
						data: 'row-per-page',
						subMenu: [
							...[1, 5, 10, 15, 20, 25, 50, 100, 1000].map((page) => ({
								data: ['pageSize', page],
								selected: page === pageSize,
								label: page,
							})),
							{
								data: ['pageSize', Infinity],
								selected: Infinity === pageSize,
								label: intl.formatMessage({ defaultMessage: 'All' }),
							},
						],
					},
				],
			},
			props.schema && {
				divider: true,
			},
			props.schema && {
				label: intl.formatMessage({ defaultMessage: 'Pivot' }),
				icon: <TableAlias />,
				data: 'pivot',
			},
			props.schema && {
				divider: true,
			},
			{
				label: intl.formatMessage({ defaultMessage: 'Report' }),
				icon: <Report />,
				data: 'report',
				subMenu: [
					{
						icon: <Save />,
						label: intl.formatMessage({ defaultMessage: 'Save Report' }),
						data: 'save-report',
					},
					{
						icon: <Reset />,
						data: 'reset',
						label: intl.formatMessage({ defaultMessage: 'Reset' }),
					},
				],
			},
			props.schema && {
				divider: true,
			},
			{
				icon: <Download />,
				data: 'download',
				label: intl.formatMessage({ defaultMessage: 'Download' }),
			},
			{
				divider: true,
			},
			{
				icon: <Help />,
				data: 'help',
				label: intl.formatMessage({ defaultMessage: 'Help' }),
			},
		].filter(Boolean) as Items;
	}, [intl, pageSize, props.schema]);

	return (
		<StatefulPopover
			content={({ close }) => (
				<NestedMenu
					items={items}
					hasParent={false}
					onItemSelect={(item: any) => {
						props.onAction?.(item.data);

						if (Array.isArray(item.data)) {
							if (item.data[0] === 'pageSize') {
								const datum = item.data[1] as number;

								setState((prev) => {
									return {
										...((prev || {}) as Partial<DatatableState>),
										pagination: {
											pageIndex: 0,
											pageSize: datum,
										},
									};
								});
							}
						}
					}}
					onClose={close}
				/>
			)}
			placement="bottomLeft"
			returnFocus
			autoFocus
		>
			<Button
				size="compact"
				kind="secondary"
				endEnhancer={<ChevronDown />}
				overrides={{
					EndEnhancer: {
						style: {
							marginLeft: 0,
						},
					},
					Root: {
						style: {
							width: '100%',
						},
					},
				}}
			>
				{intl.formatMessage({
					defaultMessage: 'Action',
				})}
			</Button>
		</StatefulPopover>
	);
}
