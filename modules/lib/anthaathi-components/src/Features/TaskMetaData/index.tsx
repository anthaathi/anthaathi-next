import { Cell, Grid } from 'baseui/layout-grid';
import { LabelSmall } from 'baseui/typography';
import React from 'react';
import { Responsive } from 'baseui/layout-grid/types';
import { styled } from 'baseui';

export interface TaskMetaDataProps {
	children: React.ReactNode[];
	span?: Responsive<number>;
	gaps?: Responsive<number>;
}

export function TaskMetaData(props: TaskMetaDataProps) {
	return (
		<Grid gridMaxWidth={0} gridMargins={0} gridGaps={props.gaps}>
			{React.Children.map(props.children, (child) => {
				return <Cell span={props.span ?? 3}>{child}</Cell>;
			})}
		</Grid>
	);
}

export interface TaskMetaDataItemProps {
	children: React.ReactNode;
	title: React.ReactNode;
}

export function TaskMetaDataItem(props: TaskMetaDataItemProps) {
	return (
		<React.Fragment>
			<LabelSmall
				$style={{
					marginBottom: '12px',
					fontWeight: 600,
				}}
			>
				{props.title}
			</LabelSmall>

			{props.children}
		</React.Fragment>
	);
}

export interface TaskTableProps {
	children: React.ReactNode[] | React.ReactNode;
}

export function TaskTable(props: TaskTableProps) {
	return (
		<Table>
			<tbody>
				{React.Children.map(props.children, (item) => {
					return <Tr>{item}</Tr>;
				})}
			</tbody>
		</Table>
	);
}

const Table = styled('table', {
	borderCollapse: 'collapse',
	width: '100%',
	border: 'none',
});

const Tr = styled('tr', {});

export const TaskTableData = styled('td', ({ $theme }) => ({
	border: 'none',
	paddingBottom: '12px',
	...$theme.typography.ParagraphMedium,
}));
