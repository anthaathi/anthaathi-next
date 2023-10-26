import { Pagination, Size } from 'baseui/pagination';
import React from 'react';
import { Block } from 'baseui/block';
import { FlexFill } from '../../../Header';
import { Button } from 'baseui/button';
import { FormattedMessage } from 'react-intl';

export type DataTablePaginationProps = SizedConfig | LoadMoreConfig;

export interface SizedConfig {
	type: 'sized';
	numPages: number;
	currentPage: number;
	onChangePage: (page: number) => void;
	size: Size;
}

export interface LoadMoreConfig {
	type: 'load-more';
	onLoadMore: () => void;
	isLoadingNext: boolean;
	hasNext: boolean;
}

export function DataTablePagination(props: DataTablePaginationProps) {
	return (
		<Block display="flex">
			<FlexFill />
			{props.type === 'load-more' && props.hasNext && (
				<Button isLoading={props.isLoadingNext} onClick={props.onLoadMore}>
					<FormattedMessage defaultMessage="Load more" />
				</Button>
			)}
			{props.type === 'sized' && (
				<Pagination
					numPages={props.numPages}
					currentPage={props.currentPage}
					onPageChange={({ nextPage }) => {
						props.onChangePage(Math.min(Math.max(nextPage, 1), props.numPages));
					}}
					size={props.size}
				/>
			)}
		</Block>
	);
}
