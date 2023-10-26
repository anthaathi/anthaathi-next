import { useDatatableConfig } from '../context/use-datatable-context';
import { Tag } from 'baseui/tag';
import { FormSchema } from '../../FormBuilder/types';
import { useStyletron } from 'styletron-react';

export function ShowAppliedFilters({ schema }: { schema: FormSchema }) {
	const { config, setConfig } = useDatatableConfig();

	const [css] = useStyletron();

	return (
		<div className={css({ display: 'flex', flexWrap: 'wrap' })}>
			{config.filters.$kind === 'and' &&
				config.filters.and.map((filter, index) => {
					if (filter.$kind !== 'field') {
						return null;
					}

					const title =
						filter.key === '::all::'
							? 'Row'
							: schema.properties[filter.key].title;

					return (
						<Tag
							overrides={{ Text: { style: { maxWidth: 'none' } } }}
							closeable={true}
							key={index + filter.key}
							onActionClick={() => {
								setConfig((prev) => {
									if (prev.filters.$kind !== 'and') {
										return prev;
									}

									return {
										...prev,
										filters: {
											...prev.filters,
											and: prev.filters.and.filter(
												(_, index1) => index1 !== index
											),
										},
									};
								});
							}}
						>
							{title} {filter.operator} {filter.value?.toString() ?? ''}
						</Tag>
					);
				})}
		</div>
	);
}
