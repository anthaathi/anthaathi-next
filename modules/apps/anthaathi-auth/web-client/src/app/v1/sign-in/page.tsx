import { firstSearchParam, SearchParam } from '@/utils/first-search-param';
import kratosClient from '@/utils/kratos-client';
import { AxiosError } from 'axios';
import { getPlainCookie } from '@/utils/get-plain-cookie';
import { ErrorRenderer } from '@/containers/ErrorRenderer';
import { SignInContainer } from '@/containers/Auth/SignIn';
import { config } from '@anthaathi-internal/config';

const companyName = config.get('companyName');
const appName = config.get('appName');

export default async function SignIn(props: { searchParams: SearchParam }) {
  try {
    const flowId = firstSearchParam(props.searchParams['flow'])!;

    const flow = await kratosClient.getLoginFlow({
      cookie: getPlainCookie(),
      id: flowId,
    });

    return (
      <SignInContainer
        appName={appName}
        flow={flow.data}
        companyName={companyName}
      />
    );
  } catch (e: unknown | AxiosError) {
    return <ErrorRenderer companyName={companyName} error={e} />;
  }
}
