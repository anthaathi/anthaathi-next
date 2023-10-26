import { getSessionIfExists } from '@/utils/get-session-if-exists';
import { redirect } from 'next/navigation';
import { firstSearchParam, SearchParam } from '@/utils/first-search-param';
import kratosClient from '@/utils/kratos-client';
import { AxiosError } from 'axios';
import { getPlainCookie } from '@/utils/get-plain-cookie';
import { ErrorRenderer } from '@/containers/ErrorRenderer';
import { config } from '@anthaathi-internal/config';
import { SignUpContainer } from '@/containers/Auth/SignUp';

const companyName = config.get('companyName');
const appName = config.get('appName');

export default async function SignUp(props: { searchParams: SearchParam }) {
  const session = await getSessionIfExists();
  const returnUrl =
    firstSearchParam(props.searchParams['return-url']) ??
    firstSearchParam(props.searchParams['return_to']);

  if (session) {
    redirect(returnUrl ?? '/');
  }

  try {
    const flowId = firstSearchParam(props.searchParams['flow'])!;

    const flow = await kratosClient.getRegistrationFlow({
      cookie: getPlainCookie(),
      id: flowId,
    });

    return (
      <SignUpContainer
        flow={flow.data}
        appName={appName}
        companyName={companyName}
      />
    );
  } catch (e: unknown | AxiosError) {
    return <ErrorRenderer companyName={companyName} error={e} />;
  }
}
