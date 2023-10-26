import { Button, KIND, SHAPE, SIZE } from 'baseui/button';
import { useIntl } from 'react-intl';
import { useStyletron } from 'baseui';
import { Reset } from '@carbon/icons-react';

export function DataTableReset() {
	const intl = useIntl();
	const [css, $theme] = useStyletron();

	return (
		<div
			className={css({
				marginLeft: $theme.sizing.scale200,
				marginRight: $theme.sizing.scale200,
				display: 'none',
				flexGrow: 1,
				[$theme.mediaQuery.medium]: {
					display: 'flex',
					flexGrow: 'unset',
				},
			})}
		>
			<Button
				kind="secondary"
				size="compact"
				overrides={{
					Root: {
						style: {
							width: 'auto',
							[$theme.mediaQuery.medium]: {
								width: '100%',
							},
						},
					},
				}}
			>
				{intl.formatMessage({ defaultMessage: 'Reset' })}
			</Button>
		</div>
	);
}

export function DataTableResetMobile() {
	const [, $theme] = useStyletron();

	return (
		<Button
			kind={KIND.secondary}
			shape={SHAPE.square}
			size={SIZE.compact}
			overrides={{
				Root: {
					style: {
						display: 'block',
						[$theme.mediaQuery.medium]: {
							display: 'none',
						},
					},
				},
			}}
		>
			<Reset />
		</Button>
	);
}
