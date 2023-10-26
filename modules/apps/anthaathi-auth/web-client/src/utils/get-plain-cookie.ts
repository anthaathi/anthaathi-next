import { cookies } from 'next/headers';

export function getPlainCookie() {
  return cookies()
    .getAll()
    .map((res) => `${res.name}=${res.value}`)
    .join(';');
}
