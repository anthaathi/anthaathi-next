import { SettingsContainer } from '@/containers/Settings';
import { getSessionIfExists } from '@/utils/get-session-if-exists';
import { redirect } from 'next/navigation';
import kratosClient from '@/utils/kratos-client';
import { getPlainCookie } from '@/utils/get-plain-cookie';
import { firstSearchParam, SearchParam } from '@/utils/first-search-param';

export default async function Settings(props: { searchParams: SearchParam }) {
  const session = await getSessionIfExists();

  if (!session) {
    return redirect(
      `/v1/sign-in?return-url=${encodeURIComponent(
        'http://account.anthaathi.localhost:8443/v1/my-account',
      )}`,
    );
  }

  const flowId = firstSearchParam(props.searchParams['flow'])!;

  const flow = await kratosClient.getSettingsFlow({
    cookie: getPlainCookie(),
    id: flowId,
  });

  return <SettingsContainer flow={flow.data} />;
}
