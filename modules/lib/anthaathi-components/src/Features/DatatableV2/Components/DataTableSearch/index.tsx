import { Input } from 'baseui/input';
import { useStyletron } from 'baseui';
import { Button } from 'baseui/button';
import { ChevronDown, Search } from '@carbon/icons-react';
import { useIntl } from 'react-intl';
import { JSONObject } from '../../../FormBuilderV2/type';

export interface DataTableSearchProps {
	schema?: JSONObject;
}

export function DataTableSearch(props: DataTableSearchProps) {
	const [css, $theme] = useStyletron();
	const intl = useIntl();

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
			}}
			className={css({
				marginLeft: $theme.sizing.scale200,
				marginRight: $theme.sizing.scale200,
				display: 'flex',
				flexDirection: 'row',
				borderRadius: $theme.borders.buttonBorderRadius,
				width: '100%',
				[$theme.mediaQuery.medium]: {
					width: 'auto',
				}
			})}
		>
			{props.schema && (
				<>
					<Button
						kind="secondary"
						size="compact"
						overrides={{
							Root: {
								style: {
									borderBottomRightRadius: 0,
									borderTopRightRadius: 0,
								},
							},
							EndEnhancer: {
								style: {
									marginLeft: $theme.sizing.scale100,
								},
							},
						}}
						endEnhancer={<ChevronDown size={12 as never} />}
					>
						<Search />
					</Button>
				</>
			)}
			<Input
				size="compact"
				placeholder={intl.formatMessage({ defaultMessage: 'Search' })}
				overrides={{
					Root: {
						style: {
							borderBottomRightRadius: 0,
							borderTopRightRadius: 0,

							...(props.schema
								? {
										borderTopLeftRadius: 0,
										borderBottomLeftRadius: 0,
								  }
								: {}),
						},
					},
					Input: {
						style: {
							backgroundColor: $theme.colors.backgroundPrimary,
						},
					},
				}}
			/>
			<Button
				kind="secondary"
				size="compact"
				overrides={{
					Root: {
						style: {
							borderBottomLeftRadius: 0,
							borderTopLeftRadius: 0,
						},
					},
				}}
			>
				{intl.formatMessage({ defaultMessage: 'Go' })}
			</Button>
		</form>
	);
}
