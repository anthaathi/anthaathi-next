import { getSessionIfExists } from '@/utils/get-session-if-exists';
import { redirect } from 'next/navigation';
import { firstSearchParam, SearchParam } from '@/utils/first-search-param';
import kratosClient from '@/utils/kratos-client';
import { AxiosError } from 'axios';
import { getPlainCookie } from '@/utils/get-plain-cookie';
import { ErrorRenderer } from '@/containers/ErrorRenderer';
import { config } from '@anthaathi-internal/config';
import { RecoveryContainer } from '@/containers/Auth/Recovery';

const companyName = config.get('companyName');

export default async function SignIn(props: { searchParams: SearchParam }) {
  const session = await getSessionIfExists();
  const returnUrl =
    firstSearchParam(props.searchParams['return-url']) ??
    firstSearchParam(props.searchParams['return_to']);

  if (session) {
    return redirect(returnUrl ?? '/');
  }

  try {
    const flowId = firstSearchParam(props.searchParams['flow'])!;

    const flow = await kratosClient.getRecoveryFlow({
      cookie: getPlainCookie(),
      id: flowId,
    });

    return <RecoveryContainer flow={flow.data} companyName={companyName} />;
  } catch (e: unknown | AxiosError) {
    return <ErrorRenderer companyName={companyName} error={e} />;
  }
}
