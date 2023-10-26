import { styled, useStyletron } from 'baseui';
import { useRecoilValue } from 'recoil';
import { sidebarAtom, SidebarAtomType } from '../../atoms';
import { StyleObject } from 'styletron-react';
import { Link, LinkProps, useMatch, useSearchParams } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';
import { LabelSmall } from 'baseui/typography';
import { Accordion, Panel } from 'baseui/accordion';

export type SidebarItemType = 'section' | 'accordion' | 'item' | 'spacer';

export interface SidebarItemData {
	type: SidebarItemType;
	label: React.ReactNode;
	key: string;
	to?: string;
	icon?: React.ReactNode;
	items?: SidebarItemData[];
	info?: object;
	isDefaultOpen?: boolean;
	onClick?: VoidFunction;
}

export interface SidebarProps {
	items: SidebarItemData[];
}

export default function Sidebar(props: SidebarProps) {
	const sidebarOpen = useRecoilValue(sidebarAtom);
	const spanDivRef = useRef<HTMLAnchorElement>(null);
	const [css] = useStyletron();

	useEffect(() => {
		if (sidebarOpen === 'open') {
			spanDivRef.current?.focus();
		}
	}, [sidebarOpen]);

	const [isSidebarItemsOpen, setIsSidebarItemsOpen] = useState(
		sidebarOpen === 'open',
	);
	const isOpenTimeout = useRef<number | null>();

	useEffect(() => {
		if (isOpenTimeout.current) {
			clearTimeout(isOpenTimeout.current);
		}

		if (sidebarOpen === 'open') {
			setIsSidebarItemsOpen(true);
		} else {
			isOpenTimeout.current = setTimeout(() => {
				setIsSidebarItemsOpen(false);
			}, 600);
		}
	}, [sidebarOpen]);

	return (
		<SidebarWrapper $isOpen={sidebarOpen}>
			{sidebarOpen === 'open' && (
				<a
					href="#toolbar-focus-item"
					ref={spanDivRef}
					className={css({
						border: 0,
						clip: 'rect(0 0 0 0)',
						height: 'auto',
						margin: 0,
						overflow: 'hidden',
						padding: 0,
						position: 'absolute',
						width: '1px',
						whiteSpace: 'nowrap',
					})}
					id="#toolbar-focus-item"
				>
					Toolbar
				</a>
			)}
			{isSidebarItemsOpen &&
				props.items.map((item) => {
					switch (item.type) {
						case 'spacer':
							return (
								<React.Fragment key={item.key}>
									<span
										className={css({
											flexGrow: 1,
										})}
									/>
								</React.Fragment>
							);
						case 'section':
							return (
								<SidebarSection key={item.key}>{item.label}</SidebarSection>
							);
						case 'accordion':
							return (
								<React.Fragment key={item.key}>
									<AccordionWrapper
										isNoPadding={
											!(item.icon === undefined || item.icon === null)
										}
										title={
											item.icon ? (
												<SidebarItem
													onClick={item.onClick}
													to={item.to}
													key={item.key}
												>
													<SidebarItemIcon>
														{React.isValidElement(item.icon) ? item.icon : null}
													</SidebarItemIcon>
													<SidebarItemContent>{item.label}</SidebarItemContent>
												</SidebarItem>
											) : (
												item.label
											)
										}
										isDefaultOpen={item.isDefaultOpen ?? false}
									>
										{item.items?.map((accordionItem) => {
											return (
												<SidebarItem
													onClick={accordionItem.onClick}
													to={accordionItem.to}
													key={accordionItem.key}
												>
													<SidebarItemIcon>
														{React.isValidElement(accordionItem.icon)
															? accordionItem.icon
															: null}
													</SidebarItemIcon>
													<SidebarItemContent>
														{accordionItem.label}
													</SidebarItemContent>
												</SidebarItem>
											);
										}) || []}
									</AccordionWrapper>
								</React.Fragment>
							);
						case 'item':
							return (
								<SidebarItem to={item.to} key={item.key} onClick={item.onClick}>
									<SidebarItemIcon>
										{React.isValidElement(item.icon) ? item.icon : null}
									</SidebarItemIcon>
									<SidebarItemContent>{item.label}</SidebarItemContent>
								</SidebarItem>
							);
						default:
							return null;
					}
				})}
		</SidebarWrapper>
	);
}

const AccordionWrapper = ({
	children,
	title,
	isDefaultOpen,
	isNoPadding,
}: {
	children: React.ReactNode[];
	title: React.ReactNode;
	isDefaultOpen?: boolean;
	isNoPadding?: boolean;
}) => {
	return (
		<Accordion
			accordion
			initialState={{ expanded: isDefaultOpen ? ['default'] : [] }}
		>
			<Panel
				key="default"
				title={title}
				overrides={{
					Header: {
						style: {
							fontSize: '15px',
							borderBottomRightRadius: '50px',
							borderTopRightRadius: '50px',
							...(isNoPadding
								? {
										paddingLeft: 0,
										paddingRight: 0,
										paddingTop: 0,
										paddingBottom: 0,
								  }
								: {}),
						},
					},
					PanelContainer: {
						style: {
							borderBottomStyle: 'none',
						},
					},
					ToggleIcon: {
						style: isNoPadding
							? {
									position: 'absolute',
									right: '20px',
							  }
							: {},
					},
					Content: {
						style: {
							paddingLeft: 0,
							paddingRight: 0,
							paddingTop: '4px',
							paddingBottom: 0,
						},
					},
				}}
			>
				{children}
			</Panel>
		</Accordion>
	);
};

const SidebarSection = ({ children }: { children: React.ReactNode }) => {
	const [, $theme] = useStyletron();

	return (
		<LabelSmall
			$style={{
				marginLeft: $theme.sizing.scale700,
				marginTop: $theme.sizing.scale400,
				marginBottom: $theme.sizing.scale400,
				fontWeight: 400,
			}}
		>
			{children}
		</LabelSmall>
	);
};

const SidebarItemContent = ({ children }: { children: React.ReactNode }) => {
	return <div>{children}</div>;
};

export const SidebarFlexFiller = styled('span', {
	flexGrow: 1,
});

export const SidebarItemIcon = styled('div', {
	display: 'flex',
	alignItems: 'center',
	placeItems: 'center',
	height: '38px',
	width: '48px',
});

const SidebarItem = (
	props: Omit<LinkProps, 'to'> & { to?: string; noPadding?: boolean },
) => {
	const url =
		(typeof props.to === 'string'
			? props.to.split('?')[0]
			: (props.to as unknown as Record<string, any>)?.pathname) || '';

	let isActive = useMatch(url) !== null;

	const [searchParams] = useSearchParams();

	if (isActive) {
		const params = new URLSearchParams(props.to?.split('?')[1]);

		for (let [key, value] of params.entries()) {
			if (searchParams.get(key) !== value) {
				isActive = false;
				break;
			}
		}
	}

	return (
		<SidebarItemStyled
			$style={
				props.noPadding
					? {
							paddingTop: 0,
							paddingBottom: 0,
							paddingLeft: 0,
							paddingRight: 0,
					  }
					: {}
			}
			$as={props.to ? Link : 'a'}
			target={props.to && props.to.startsWith('/') ? undefined : '_blank'}
			$isActive={typeof props.onClick !== 'function' && Boolean(isActive)}
			{...props}
		>
			{props.children}
		</SidebarItemStyled>
	);
};

const SidebarItemStyled = styled<
	typeof Link,
	{
		$isActive?: boolean;
	}
>(Link, ({ $theme, $isActive }) => ({
	display: 'flex',
	textDecoration: 'none',
	height: '48px',
	width: `calc(100% - ${$theme.sizing.scale800} - ${$theme.sizing.scale800})`,
	alignItems: 'center',
	paddingLeft: $theme.sizing.scale700,
	paddingRight: $theme.sizing.scale700,
	borderBottomRightRadius: '50px',
	borderTopRightRadius: '50px',
	// @ts-ignore
	color: $theme.colors.contentPrimary,
	...$theme.typography.LabelMedium,
	userSelect: 'none',
	...SidebarAnimation,
	transitionProperty: 'background-color',
	transitionDuration: '100ms',
	position: 'relative',
	borderWidth: '4px',
	marginBottom: $theme.sizing.scale0,
	...($isActive
		? {
				backgroundColor: $theme.colors.accent50,
				color: $theme.colors.accent,
				fontWeight: 500,
				':hover': {
					zIndex: 1,
				},
		  }
		: {
				backgroundColor: $theme.colors.backgroundPrimary,
				':hover': {
					backgroundColor: $theme.colors.accent100,
				},
		  }),
}));

const SidebarWrapper = styled<'div', { $isOpen: SidebarAtomType }>(
	'div',
	({ $isOpen, $theme }) => ({
		position: 'fixed',
		top: '64px',
		backgroundColor: $theme.colors.backgroundPrimary,
		boxShadow: $theme.lighting.shadow500,
		left: 0,
		zIndex: 99,
		width: '80vw',
		minWidth:
			SidebarWidth[$isOpen] === '0px'
				? SidebarWidth['open']
				: SidebarWidth[$isOpen],
		[$theme.mediaQuery.medium]: {
			width:
				SidebarWidth[$isOpen] === '0px'
					? SidebarWidth['open']
					: SidebarWidth[$isOpen],
			boxShadow: 'none',
		},
		bottom: 0,
		transform: $isOpen === 'open' ? 'translateX(0)' : 'translateX(-100%)',
		...SidebarAnimation,
		display: 'flex',
		flexDirection: 'column',
		borderRight: `1px solid ${$theme.colors.borderOpaque}`,
	}),
);

export const SidebarAnimation: StyleObject = {
	transitionTimingFunction: 'cubic-bezier(0.25, 0.8, 0.25, 1)',
	transitionDuration: '0.4s',
	transitionProperty: 'transform',
};

export const SidebarWidth: Record<SidebarAtomType, string> = {
	open: '320px',
	close: '0px',
};
