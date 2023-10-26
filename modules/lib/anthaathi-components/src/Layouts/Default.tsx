import React from 'react';
import Header, { ProfileProps } from '../Features/Header';
import Sidebar, { SidebarItemData } from '../Features/Sidebar';

export interface DefaultProps {
	children: React.ReactNode;
	items: SidebarItemData[];
	pageTitle?: React.ReactNode;
	profileProps?: ProfileProps;
	pageTitleTo?: string;
}

export default function DefaultLayout(props: DefaultProps) {
	return (
		<>
			<Header
				hasSidebar={props.items && props.items.length !== 0}
				title={props.pageTitle}
				pageTitleTo={props.pageTitleTo}
				profileProps={
					props.profileProps ?? { items: [], onItemClick: () => {} }
				}
			/>
			{props.items && props.items.length !== 0 && (
				<Sidebar items={props.items} />
			)}
			{props.children}
		</>
	);
}
