import { styled, useStyletron } from 'baseui';
import React, { useCallback } from 'react';
import { Menu } from 'baseui/icon';
import { HeadingXSmall } from 'baseui/typography';
import { PopoverFix, Search } from '../Search';
import { Link } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { sidebarAtom } from '../../atoms';
import { PLACEMENT, StatefulPopover } from 'baseui/popover';
import { Block } from 'baseui/block';
import { ListItemLabel, MenuAdapter } from 'baseui/list';
import { Logout, User } from '@carbon/icons-react';
import { StatefulMenu } from 'baseui/menu';
import { useIntl } from 'react-intl';
import { useKratos, useSession } from '../Auth/context/KratosContext';

export interface HeaderProps {
	title?: React.ReactNode;
	profileProps: ProfileProps;
	hasSidebar?: boolean;
	pageTitleTo?: string;
}

export default function Header(props: HeaderProps) {
	const [css, $theme] = useStyletron();
	const [, setIsOpen] = useRecoilState(sidebarAtom);
	const intl = useIntl();

	return (
		<HeaderWrapper>
			<HeaderContent>
				<a
					href="#main"
					className={css({
						background: $theme.colors.backgroundTertiary,
						height: '30px',
						padding: '8px',
						position: 'absolute',
						textDecoration: 'none',
						transform: 'translateY(-200%)',
						transition: 'transform 0.3s',
						display: 'flex',
						alignItems: 'center',
						placeContent: 'center',
						...$theme.typography.LabelSmall,
						color: $theme.colors.tabColor,
						':focus': {
							transform: 'translateY(0%)',
						},
					})}
				>
					{intl.formatMessage({ defaultMessage: 'Skip to content' })}
				</a>

				{props.hasSidebar && (
					<>
						<ToolbarButton
							data-test-id="main-toggle-menu"
							onClick={() =>
								setIsOpen((prev) => (prev === 'close' ? 'open' : 'close'))
							}
						>
							<Menu size={20} color={$theme.colors.backgroundPrimary} />
						</ToolbarButton>
						<HeaderSpace />
					</>
				)}

				<HeadingTitle {...props} />

				<FlexFill />

				<Search />

				<FlexFill />

				<ToolbarSpace />

				<Profile {...props.profileProps} />
			</HeaderContent>
		</HeaderWrapper>
	);
}

export interface ProfileItem {
	title: React.ReactNode;
	icon: React.ReactNode;
	key: React.Key;
}

export interface ProfileProps {
	items: ProfileItem[];
	onItemClick: (item: ProfileItem) => void;
}

export function useLogout() {
	const kratos = useKratos();

	return useCallback(
		(returnUrl?: string) => {
			const returnToParam = returnUrl
				? '?return_to=' + encodeURIComponent(returnUrl)
				: '';

			fetch(
				`${kratos.authBaseURL}/self-service/logout/browser${returnToParam}`,
				{
					method: 'GET',
					credentials: 'include',
				}
			)
				.then((docs) => {
					if (docs.status !== 200) {
						console.error(docs);
						throw new Error('Something went wrong');
					}

					return docs.json();
				})
				.then((docs) => {
					// @ts-ignore
					window.location.href = docs.logout_url;
				});
		},
		[kratos.authBaseURL]
	);
}

function Profile(props: ProfileProps) {
	const [, $theme] = useStyletron();
	const intl = useIntl();
	const session = useSession();
	const logout = useLogout();

	return (
		<StatefulPopover
			placement={PLACEMENT.bottomRight}
			content={({ close }) => (
				<>
					<Block
						overrides={{
							Block: {
								style: {
									backgroundColor: $theme.colors.backgroundPrimary,
									color: $theme.colors.contentPrimary,
									width: '230px',
								},
							},
						}}
					>
						<StatefulMenu
							items={(props.items || []).concat(
								[
									session && {
										title: intl.formatMessage({ defaultMessage: 'Logout' }),
										key: 'logout',
										icon: Logout as never,
									},
								].filter(Boolean) as ProfileItem[]
							)}
							onItemSelect={({ item }) => {
								switch (item.key) {
									case 'logout':
										logout();
								}
								close();
								props.onItemClick?.(item);
							}}
							overrides={{
								Option: {
									props: {
										overrides: {
											ListItem: {
												component: React.forwardRef((props: any, ref) => (
													<MenuAdapter
														{...props}
														ref={ref}
														$size="mini"
														artwork={props.item.icon}
														overrides={{
															Root: {
																props: {
																	'data-testid': props.item.key,
																},
															},
														}}
													>
														<ListItemLabel>{props.item.title}</ListItemLabel>
													</MenuAdapter>
												)),
											},
										},
									},
								},
							}}
						/>{' '}
					</Block>
					<PopoverFix />
				</>
			)}
		>
			<ToolbarButton data-testid="profile-button">
				<User size={22 as never} />
			</ToolbarButton>
		</StatefulPopover>
	);
}

export const ToolbarSpace = styled('div', ({ $theme }) => ({
	width: $theme.sizing.scale200,
}));

export const ToolbarButton = styled('button', ({ $theme }) => ({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	backgroundColor: $theme.colors.accent500,
	color: $theme.colors.backgroundPrimary,
	padding: $theme.sizing.scale400,
	border: '2px solid transparent',
	borderRadius: $theme.sizing.scale200,
	cursor: 'pointer',
	outline: 'none',
	transition: 'all 0.2s ease-in-out',
	':hover': {
		backgroundColor: $theme.colors.accent700,
		border: '2px solid ' + $theme.colors.backgroundPrimary,
	},
	':focus': {
		backgroundColor: $theme.colors.accent700,
		border: '2px solid ' + $theme.colors.backgroundPrimary,
	},
}));

export const HeadingTitle = (props: HeaderProps) => {
	const [css, $theme] = useStyletron();

	return (
		<Link
			to={props.pageTitleTo ?? '/'}
			className={css({ textDecoration: 'none' })}
		>
			<HeadingXSmall
				$style={{
					color: $theme.colors.backgroundPrimary,
					userSelect: 'none',
				}}
				marginTop={0}
				marginBottom={0}
			>
				{props.title ?? 'Dashboard | Anthaathi'}
			</HeadingXSmall>
		</Link>
	);
};

export const HeaderSpace = styled('span', ({ $theme }) => ({
	width: $theme.sizing.scale600,
}));

export const HeaderContent = styled('div', ({ $theme }) => ({
	display: 'flex',
	alignItems: 'center',
	paddingLeft: $theme.sizing.scale600,
	paddingRight: $theme.sizing.scale600,
	height: '64px',
}));

const HeaderWrapper = styled('div', ({ $theme }) => ({
	boxShadow: 'rgba(0, 0, 0, 0.16) 6px 2px 8px',
	backgroundColor: $theme.colors.backgroundAccent,
	position: 'fixed',
	top: 0,
	left: 0,
	right: 0,
	zIndex: 1,
}));

export const FlexFill = styled('span', {
	flexGrow: 1,
});
