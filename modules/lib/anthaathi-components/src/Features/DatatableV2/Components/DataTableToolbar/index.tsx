import React from 'react';
import { styled, useStyletron } from 'baseui';
import { DataTableSearch } from '../DataTableSearch';
import { DataTableViewToggle } from '../DataTableViewToggle';
import { DataTableAction } from '../DataTableAction';
import { DataTableReset, DataTableResetMobile } from '../DataTableReset';
import { FlexFill } from '../../../Header';
import { DataTableTheme } from '../../type';
import { JSONObject } from '../../../FormBuilderV2/type';

export interface DataTableToolbarProps {
	actionButton?: React.ReactNode;
	theme?: DataTableTheme;
	schema?: JSONObject;
	onTableAction?: (input: string | string[]) => void;
}

export function DataTableToolbar(props: DataTableToolbarProps) {
	const [css, $theme] = useStyletron();

	return (
		<div
			className={css({
				display: 'flex',
				alignItems: 'center',
				backgroundColor:
					props.theme === 'dark'
						? $theme.colors.backgroundSecondary
						: $theme.colors.backgroundPrimary,
				flexDirection: 'column',
				paddingTop: $theme.sizing.scale400,
				[$theme.mediaQuery.medium]: {
					flexDirection: 'row',
					height: '54px',
					paddingTop: 0,
				},
			})}
		>
			<div
				className={css({
					display: 'flex',
					width: '100%',
					paddingBottom: $theme.sizing.scale400,
					[$theme.mediaQuery.medium]: {
						paddingBottom: 0,
						flexDirection: 'row',
						width: 'auto',
					},
				})}
			>
				<DataTableSearch schema={props.schema} />
				<Divider />
				{props.schema && (
					<>
						<DataTableViewToggle />
						<Divider />

						<span
							className={css({
								width: '12px',
							})}
						></span>

						<div>
							<DataTableResetMobile />
						</div>

						<span
							className={css({
								width: $theme.sizing.scale400,
								display: 'block',
								[$theme.mediaQuery.medium]: {
									display: 'none',
								},
							})}
						/>
					</>
				)}
			</div>

			<div
				className={css({
					width: 'calc(100% - 12px)',
					paddingBottom: $theme.sizing.scale400,
					[$theme.mediaQuery.medium]: {
						paddingBottom: 0,
						width: 'auto',
					},
				})}
			>
				<DataTableAction onAction={props.onTableAction} schema={props.schema} />
			</div>

			<div
				className={css({
					display: 'flex',
					alignItems: 'center',
					flexGrow: 1,
					width: '100%',
					[$theme.mediaQuery.medium]: {
						width: 'auto',
					},
				})}
			>
				<FlexFill
					$style={{
						display: 'none',
						[$theme.mediaQuery.medium]: {
							display: 'block',
						},
					}}
				/>

				<DataTableReset />

				{props.actionButton && (
					<div
						className={css({
							marginLeft: $theme.sizing.scale200,
							marginRight: $theme.sizing.scale200,
							width: 'max-content',
						})}
					>
						{props.actionButton}
					</div>
				)}
			</div>
		</div>
	);
}

const Divider = styled('div', ({ $theme }) => ({
	borderLeftColor: $theme.borders.border200.borderColor,
	borderLeftWidth: $theme.borders.border200.borderWidth,
	borderLeftStyle: $theme.borders.border200.borderStyle,
	height: '40%',
	display: 'none',
	[$theme.mediaQuery.medium]: {
		display: 'block',
	},
	marginLeft: $theme.sizing.scale400,
	marginRight: $theme.sizing.scale400,
}));
