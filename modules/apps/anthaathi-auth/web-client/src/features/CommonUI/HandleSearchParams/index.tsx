'use client';
import React, { useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { LoginFlow, RecoveryFlow, RegistrationFlow } from '@ory/kratos-client';

export function HandleSearchParams(props: {
  children: React.ReactNode;
  flow: LoginFlow | RegistrationFlow | RecoveryFlow;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    current.set('flow', props.flow.id);

    const search = current.toString();
    const query = search ? `?${search}` : '';
    router.push(`${pathname}${query}`);
  }, [pathname, props.flow.id, router, searchParams]);

  return <>{props.children}</>;
}
