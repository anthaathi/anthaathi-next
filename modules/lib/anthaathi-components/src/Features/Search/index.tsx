import { useStyletron } from 'baseui';
import { useIntl } from 'react-intl';
import { Select } from 'baseui/select';
import { GlobalSearchDataSourceReturn, useDataSource } from '../Datasource';
import { useCallback, useState } from 'react';
import { Value } from 'baseui/select/types';
import { useNavigate } from 'react-router-dom';

export function Search() {
	const [css, $theme] = useStyletron();
	const intl = useIntl();
	const {
		dataSources: { search },
	} = useDataSource();
	const [result, setState] = useState<GlobalSearchDataSourceReturn>();
	const [isLoading, setLoading] = useState(false);
	const [value] = useState<Value>([]);
	const navigate = useNavigate();
	const [isOpen, setIsOpen] = useState(false);

	const loadData = useCallback(
		(searchTerm: string) => {
			setLoading(true);
			search?.(
				{
					search: searchTerm,
				},
				null
			).then((result) => {
				setState(result);
				setLoading(false);
			});
		},
		[search]
	);

	return (
		<div
			className={css({
				display: 'none',
				[$theme.mediaQuery.large]: { display: 'block', width: '420px' },
			})}
		>
			<Select
				value={value}
				placeholder={intl.formatMessage({ defaultMessage: 'Search' })}
				type="search"
				onOpen={() => {
					loadData('');
					setIsOpen(true);
				}}
				onClose={() => {
					setIsOpen(false);
				}}
				onInputChange={(e) => {
					loadData(e.target.value);
				}}
				isLoading={isLoading}
				valueKey="id"
				labelKey="label"
				options={result?.items}
				filterOptions={(options) => options}
				onChange={({ value, option, type }) => {
					if (type !== 'select' || option == null) {
						return;
					}

					if (option.onClick) {
						option.onClick?.();
					} else if (option.to) {
						navigate(option.to);
					}
				}}
				overrides={{
					Popover: {
						style: {
							zIndex: $theme.zIndex.modal,
						},
						props: {
							id: 'search-dropdown-global-search',
						},
					},

					ValueContainer: {
						style: {
							paddingTop: $theme.sizing.scale200,
							paddingBottom: $theme.sizing.scale200,
							zIndex: 1,
						},
					},
					SearchIconContainer: {
						style: {
							width: '22px',
						},
					},
				}}
			/>

			{isOpen && <PopoverFix />}
		</div>
	);
}

export const PopoverFix = () => (
	<style
		dangerouslySetInnerHTML={{
			// language=CSS
			__html: `
      [data-baseweb="popover"] {
            z-index: 9999;
        }
      `,
		}}
	/>
);
