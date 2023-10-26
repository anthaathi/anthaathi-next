import kratosClient from '@/utils/kratos-client';
import { getPlainCookie } from '@/utils/get-plain-cookie';

export async function getSessionIfExists() {
  try {
    return (
      await kratosClient.toSession({
        cookie: getPlainCookie(),
      })
    ).data;
  } catch (e: any) {
    if (e?.response?.data?.error?.code === 401) {
      return null;
    }

    throw e;
  }
}
