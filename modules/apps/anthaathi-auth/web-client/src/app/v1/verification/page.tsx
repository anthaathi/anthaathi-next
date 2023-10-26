import { firstSearchParam, SearchParam } from '@/utils/first-search-param';
import kratosClient from '@/utils/kratos-client';
import { AxiosError } from 'axios';
import { getPlainCookie } from '@/utils/get-plain-cookie';
import { ErrorRenderer } from '@/containers/ErrorRenderer';
import { config } from '@anthaathi-internal/config';
import { VerificationContainer } from '@/containers/Auth/VerificationContainer';

const companyName = config.get('companyName');
const appName = config.get('appName');

export default async function Verification(props: {
  searchParams: SearchParam;
}) {
  try {
    const flowId = firstSearchParam(props.searchParams['flow'])!;

    const flow = await kratosClient.getRecoveryFlow({
      cookie: getPlainCookie(),
      id: flowId,
    });

    return (
      <VerificationContainer
        flow={flow.data}
        companyName={companyName}
        appName={appName}
      />
    );
  } catch (e: unknown | AxiosError) {
    return <ErrorRenderer companyName={companyName} error={e} />;
  }
}
