import { atom } from 'recoil';

export const taskSidebarAtom = atom<string | null>({
  default: null,
  key: 'taskSidebarAtom',
});
