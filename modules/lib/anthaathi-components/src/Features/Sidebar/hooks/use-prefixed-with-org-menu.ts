import { useCallback } from 'react';
import { SidebarItemData } from '../index';
import { useParams } from 'react-router-dom';

export function usePrefixedWithOrgMenu() {
	const params = useParams<{ key: string }>();

	const handleChange = useCallback(
		(item: SidebarItemData[]) => {
			return item.map((res) => {
				if (!res.to) {
					return { ...res, items: handleChange(res.items ?? []) };
				}

				return {
					...res,
					items: handleChange(res.items ?? []),
					to: '/o/' + params.key + res.to,
				};
			});
		},
		[params.key],
	);

	return handleChange;
}
