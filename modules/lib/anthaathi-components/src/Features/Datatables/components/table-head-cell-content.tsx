import { ConditionalSchemaPropertiesReturn } from '../../DataCommon/hooks/use-conditional-schema-properties';
import { useStyletron } from 'baseui';
import React, { useRef } from 'react';
import {
	ArrowDown,
	ArrowUp,
	SortAscending,
	SortDescending,
} from '@carbon/icons-react';
import {
	TableHeadCellOverlayOption,
	TableHeadCellOverlayOptionButton,
} from './table-head-cell-overlay-option-button';
import { TableHeadCell } from './styled-tables';
import { useDatatableConfig } from '../context/use-datatable-context';

export const TableHeadCellContent = ({
	activeHeaderItem,
	formFields,
	column,
	setSort,
	sortDirection,
	sortKey,
	setActiveHeaderItem,
}: {
	activeHeaderItem: string | null;
	formFields: ConditionalSchemaPropertiesReturn;
	column: string;
	setSort: (sortKey: 'desc' | 'asc') => void;
	sortDirection: 'desc' | 'asc' | null;
	sortKey: string | null;
	setActiveHeaderItem: (key: string | null) => void;
}) => {
	const [css] = useStyletron();
	const ref = useRef<HTMLTableHeaderCellElement>(null);
	const { config } = useDatatableConfig();

	return (
		<TableHeadCell
			scope="col"
			$style={{
				position: 'relative',
				width: config.columnConfig[column]?.width
					? `${config.columnConfig[column].width}px`
					: 'auto',
			}}
			key={formFields[column].name}
			role="button"
			onMouseOver={() => setActiveHeaderItem(column)}
			onMouseOut={() => setActiveHeaderItem(null)}
			$isSortable={formFields[column].sortable}
		>
			<div ref={ref}>
				{formFields[column].title}
				<span className={css({ width: '6px' })}></span>
				{sortKey === formFields[column].name &&
					(sortDirection === 'desc' ? (
						<SortDescending
							className={css({
								paddingLeft: '6px',
								position: 'relative',
								top: '2px',
							})}
						/>
					) : (
						<SortAscending
							className={css({
								paddingLeft: '6px',
								position: 'relative',
								top: '2px',
							})}
						/>
					))}
				{formFields[column].sortable && activeHeaderItem === column ? (
					<TableHeadCellOverlayOption>
						<TableHeadCellOverlayOptionButton
							$active={sortKey === column && sortDirection === 'asc'}
							onClick={() => {
								setSort('asc');
							}}
						>
							<ArrowUp size={10 as never} />
						</TableHeadCellOverlayOptionButton>
						<TableHeadCellOverlayOptionButton
							$active={sortKey === column && sortDirection === 'desc'}
							onClick={() => {
								setSort('desc');
							}}
						>
							<ArrowDown size={10 as never} />
						</TableHeadCellOverlayOptionButton>
					</TableHeadCellOverlayOption>
				) : (
					<></>
				)}
			</div>
		</TableHeadCell>
	);
};
