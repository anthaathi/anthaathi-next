import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/v1/settings');
  return null;
}
