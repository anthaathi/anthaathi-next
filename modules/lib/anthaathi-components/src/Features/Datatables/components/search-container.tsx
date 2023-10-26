import React, { useMemo, useRef, useState } from 'react';
import { SearchWrapper } from './search-wrapper';
import { StatefulPopover } from 'baseui/popover';
import { StatefulMenu } from 'baseui/menu';
import { SearchButton } from './search-button';
import { SearchInput } from './search-input';
import { GoButton } from './go-button';
import { ConditionalSchemaPropertiesReturn } from '../../DataCommon/hooks/use-conditional-schema-properties';
import { useDatatableConfig } from '../context/use-datatable-context';
import { RefetchFunction } from '../index';

export interface SearchContainerProps {
	schema: ConditionalSchemaPropertiesReturn;
	refetch?: RefetchFunction;
}

export const SearchContainer = (props: SearchContainerProps) => {
	const fields = useMemo(() => {
		return [
			{
				label: 'Case sensitive',
				key: '::caseSensitive::',
				disabled: true,
			},
			{ divider: true, key: 'divider' },
			{
				label: 'All text fields',
				active: true,
				key: '::all::',
			},
			...Object.keys(props.schema)
				.filter(
					(key) =>
						props.schema[key].type === 'string' && props.schema[key].filterable
				)
				.map((key) => ({
					label: props.schema[key].title,
					id: key,
					key,
				})),
		];
	}, [props.schema]);

	const { config, setConfig } = useDatatableConfig();

	const [selectedFieldType, setSelectedFieldType] = useState('::all::');

	const [searchTerm, setSearchTerm] = useState('');

	const inputRef = useRef<HTMLInputElement | null>(null);

	function searchItem() {
		if (searchTerm === '') {
			return;
		}

		if (config.filters.$kind === 'and') {
			const newFilters = [
				...config.filters.and,
				{
					$kind: 'field',
					key: selectedFieldType,
					value: searchTerm,
					operator: 'contains',
					name: 'Search',
				},
			];

			setConfig({
				...config,
				filters: {
					...config.filters,
					and: newFilters,
				} as never,
			});
		}

		inputRef.current?.focus();

		setTimeout(() => {
			props.refetch?.(config);
		}, 0);

		setSelectedFieldType('::all::');
		setSearchTerm('');
	}

	return (
		<SearchWrapper>
			<StatefulPopover
				placement="bottomLeft"
				content={({ close }) => (
					<StatefulMenu
						onItemSelect={({ item }) => {
							setSelectedFieldType(item.key);
							inputRef?.current?.focus();
							close();
						}}
						items={fields}
					/>
				)}
				returnFocus
				autoFocus
			>
				<SearchButton />
			</StatefulPopover>
			<SearchInput
				onEnter={() => {
					searchItem();
				}}
				selectedFieldType={
					props.schema[selectedFieldType]?.title ?? selectedFieldType
				}
				ref={inputRef}
				searchTerm={searchTerm}
				onChange={(str) => setSearchTerm(str)}
			/>
			<GoButton
				onClick={() => {
					searchItem();
				}}
			/>
		</SearchWrapper>
	);
};
