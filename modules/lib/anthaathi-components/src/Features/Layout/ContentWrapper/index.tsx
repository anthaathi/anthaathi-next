import React, { useEffect, useRef, useState } from 'react';
import { styled, useStyletron } from 'baseui';
import { useRecoilValue } from 'recoil';
import { sidebarAtom } from '../../../atoms';
import { SidebarAnimation, SidebarWidth } from '../../Sidebar';
import { Link, resolvePath, useLocation } from 'react-router-dom';
import { StatefulPopover } from 'baseui/popover';
import { Menu } from 'baseui/menu';

export interface ContentWrapperProps extends ContentContextValue {
	children: React.ReactNode;
	toolbarActions?: React.ReactNode;
	maxWidth?: string;
	center?: boolean;
	basePath?: string;
	noSidebar?: boolean;
}

const ContentWrapper: React.FC<ContentWrapperProps> = (props) => {
	const sidebarOpen$ = useRecoilValue(sidebarAtom);
	const sidebarOpen = props.noSidebar ? SidebarWidth.close : sidebarOpen$;

	const { breadcrumb, toolbarTab, fullWidth, title } = props;
	const [css, $theme] = useStyletron();
	const divRef = useRef<HTMLDivElement>(null);
	const [isScrolled, setIsScrolled] = useState(false);
	const { pathname } = useLocation();

	useEffect(() => {
		const current = divRef?.current;

		function onScroll() {
			if ((current?.scrollTop ?? 0) > 200) {
				setIsScrolled(true);
			} else {
				setIsScrolled(false);
			}
		}

		current?.addEventListener('scroll', onScroll);

		return () => {
			current?.removeEventListener('scroll', onScroll);
		};
	}, []);

	useEffect(() => {
		if (typeof window === 'undefined') {
			return () => {};
		}

		const appHeight = () => {
			const doc = document.documentElement;
			doc.style.setProperty('--app-height', `${window.innerHeight}px`);
		};

		window.addEventListener('resize', appHeight);

		appHeight();

		return () => {
			window.removeEventListener('resize', appHeight);
		};
	}, []);

	return (
		<ContentWrapperContainer
			id="main"
			$style={{
				[$theme.mediaQuery.medium]: {
					marginLeft:
						sidebarOpen === 'open' ? SidebarWidth.open : SidebarWidth.close,
				},
			}}
		>
			{(breadcrumb?.length > 0 || toolbarTab?.length > 0) && (
				<HeadingToolbar
					$style={
						isScrolled
							? {
									boxShadow: $theme.lighting.shadow500,
									transition: 'box-shadow 0.3s ease',
							  }
							: {}
					}
				>
					<DivFlex
						$style={{ maxWidth: props.maxWidth ?? '100%' }}
						$center={props.center}
					>
						<BreadcrumbWrapper>
							<BreadcrumbSmallToolbar>
								{breadcrumb?.map((item, index) => (
									<BreadcrumbItem key={index}>
										{item.to ? (
											<BreadcrumbLink to={item.to}>{item.title}</BreadcrumbLink>
										) : (
											<BreadcrumbText>{item.title}</BreadcrumbText>
										)}
									</BreadcrumbItem>
								))}
								<span className={css({ marginLeft: '6px' })}></span>
								<BreadcrumbTitle $isSmall={true} $isVisible={isScrolled}>
									{title}
								</BreadcrumbTitle>
								<span className={css({ flexGrow: 1 })} />
							</BreadcrumbSmallToolbar>
							<BreadcrumbTitle $isVisible={!isScrolled}>
								{title}
							</BreadcrumbTitle>
						</BreadcrumbWrapper>
						{props.toolbarActions}
					</DivFlex>
					<ToolbarTab $maxWidth={props.maxWidth} $center={props.center}>
						{toolbarTab?.map((item, index) => {
							const Element = (
								<ToolbarTabItem
									$as={typeof item.to !== 'undefined' ? Link : 'button'}
									tabIndex={0}
									// TODO: THIS NEEDS TO BE IMPROVED
									$isActive={
										item.isActive ??
										resolvePath(
											typeof item.to === 'string'
												? item.to ?? pathname
												: pathname,
											props.basePath ?? pathname
										).pathname === pathname
									}
									key={index}
									onClick={item.onClick}
									{...(item.to ? { to: item.to } : {})}
								>
									{item.title}
								</ToolbarTabItem>
							);

							return (
								<React.Fragment key={item.key ?? index}>
									{item.children ? (
										<StatefulPopover
											popoverMargin={4}
											content={() => (
												<Menu
													items={
														item.children?.map((res, index) => {
															return {
																label: res.title,
																key: res.key ?? index,
															};
														}) ?? []
													}
													overrides={{
														List: {
															style: {
																minWidth: '160px',
															},
														},
													}}
												/>
											)}
											returnFocus
											autoFocus
											placement="bottomLeft"
										>
											{Element}
										</StatefulPopover>
									) : (
										Element
									)}
								</React.Fragment>
							);
						})}
					</ToolbarTab>
				</HeadingToolbar>
			)}
			<div
				ref={divRef}
				className={css({
					overflowX: 'auto',
					height: '100%',
				})}
				id="main-content"
			>
				{fullWidth ? (
					props.children
				) : (
					<ContentWrap>{props.children}</ContentWrap>
				)}
			</div>
		</ContentWrapperContainer>
	);
};

export const DivFlex = styled<'div', { $center?: boolean }>(
	'div',
	({ $center }) => ({
		display: 'flex',
		flexGrow: 1,
		alignItems: 'center',
		flexDirection: 'row',
		marginLeft: $center ? 'auto' : 0,
		marginRight: $center ? 'auto' : 0,
	})
);

export const ToolbarTabLink = styled(Link, {});

export interface ContentContextValue {
	breadcrumb: BreadcrumbData[];
	toolbarTab: ToolbarTabItemData[];
	title: React.ReactNode;
	fullWidth?: boolean;
}

export interface BreadcrumbData {
	title: React.ReactNode;
	to?: string;
}

export interface ToolbarTabItemData {
	title: string | React.ReactNode;
	isActive?: boolean;
	to?: string;
	onClick?: () => void;
	key?: string;
	children?: ToolbarTabItemData[];
}

// Toolbar tab
export const ToolbarTab = styled<
	'div',
	{ $maxWidth?: string; $center?: boolean }
>('div', ({ $maxWidth, $center }) => ({
	display: 'flex',
	alignItems: 'center',
	position: 'relative',
	top: '4px',
	marginBottom: '-8px',
	marginLeft: $center ? 'auto' : 0,
	marginRight: $center ? 'auto' : 0,
	maxWidth: $maxWidth,
}));

export const ToolbarTabItem = styled<'div', { $isActive?: boolean }>(
	'div',
	({ $theme, $isActive }) => ({
		display: 'flex',
		alignItems: 'center',
		paddingRight: '6px',
		paddingLeft: '6px',
		cursor: 'pointer',
		paddingBottom: '10px',
		justifyContent: 'center',
		userSelect: 'none',
		backgroundColor: 'transparent',
		paddingTop: '10px',
		borderBottom: $isActive ? `2px solid ${$theme.colors.primary}` : 'none',
		color: $isActive ? $theme.colors.primary : $theme.colors.contentPrimary,
		...$theme.typography.LabelSmall,
		borderRight: 'none',
		borderLeft: 'none',
		borderTop: 'none',
		fontWeight: $isActive ? 700 : 400,
		':hover': {
			color: '#000',
			textDecoration: 'none',
		},
		textDecoration: 'none',
	})
);

export const HeadingToolbar = styled('div', ({ $theme }) => ({
	borderBottom: `1px solid ${$theme.colors.borderOpaque}`,
	paddingLeft: $theme.sizing.scale600,
	paddingRight: $theme.sizing.scale600,
	paddingTop: $theme.sizing.scale400,
	paddingBottom: $theme.sizing.scale400,
	position: 'sticky',
	top: '64px',
	backgroundColor: $theme.colors.backgroundPrimary,
	zIndex: 1,
}));

export const BreadcrumbSmallToolbar = styled('div', ({ $theme }) => ({
	display: 'flex',
	alignItems: 'center',
	marginBottom: $theme.sizing.scale200,
}));

export const BreadcrumbItem = styled('div', () => ({
	display: 'flex',
	alignItems: 'center',
	fontSize: '14px',
	lineHeight: '20px',
	color: '#6E7687',
	marginRight: '8px',
	'::after': {
		content: '"/"',
		marginLeft: '8px',
		marginRight: '4px',
		fontSize: '16px',
		display: 'flex',
		alignItems: 'center',
		placeContent: 'center',
		position: 'relative',
		top: '2px',
	},
}));

export const BreadcrumbLink = styled(Link, ({ $theme }) => ({
	color: '#6E7687',
	textDecoration: 'none',
	...$theme.typography.LabelSmall,
	':hover': {
		color: '#000000',
	},
}));

export const BreadcrumbTitle = styled<
	'span',
	{ $isVisible?: boolean; $isSmall?: boolean }
>('span', ({ $theme, $isVisible, $isSmall }) => ({
	color: '#000000',
	...($isSmall === true
		? $theme.typography.LabelSmall
		: $theme.typography.HeadingSmall),
	transform: $isVisible === true ? 'translateY(0)' : 'translateY(-20%)',
	scale: $isSmall === true ? 1.25 : 1,
	overflow: 'hidden',
	opacity: $isVisible ? 1 : 0,
	maxHeight: $isVisible ? '1100px' : 0,
	whiteSpace: 'pre',
	top: $isSmall ? ($isVisible ? '-1px' : 0) : 0,
	position: 'relative',
	transition:
		'transform 0.6s ease, opacity 0.6s ease, max-height 0.6s cubic-bezier(0, 1, 0, 1)',
}));

export const BreadcrumbText = styled('span', ({ $theme }) => ({
	color: '#6E7687',
	...$theme.typography.LabelSmall,
}));

export const BreadcrumbWrapper = styled('div', () => ({
	display: 'flex',
	flexDirection: 'column',
	flexGrow: 1,
}));

const ContentWrap = styled('div', ({ $theme }) => ({
	padding: $theme.sizing.scale600,
	height: `calc(100% - ${$theme.sizing.scale600} - ${$theme.sizing.scale600})`,
}));

export const ContentWrapperContainer = styled('main', {
	marginTop: '64px',
	height: 'calc(var(--app-height, 100vh) - 64px)',
	display: 'flex',
	flexDirection: 'column',
	...SidebarAnimation,
	transitionProperty: 'margin-left',
});

export default ContentWrapper;
