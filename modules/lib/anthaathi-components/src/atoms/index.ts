import { atom } from 'recoil';

export type SidebarAtomType = 'open' | 'close';

export const sidebarAtom = atom<SidebarAtomType>({
	key: '_sidebarAtom',
	default: 'close',
});
