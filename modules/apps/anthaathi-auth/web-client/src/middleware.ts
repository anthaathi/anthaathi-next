import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import kratosClient from '@/utils/kratos-client';
import { createFetchAdapter } from '@haverstack/axios-fetch-adapter';
import { AxiosResponse } from 'axios';
import {
  LoginFlow,
  RecoveryFlow,
  RegistrationFlow,
  Session,
  SettingsFlow,
  VerificationFlow,
} from '@ory/kratos-client';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const url = new URL(request.url);

  url.host = request.headers.get('host') ?? url.hostname;

  const flow = url.searchParams.get('flow');
  const data = url.pathname.split('/');
  const currentFlow = data[2];

  if (
    flow === null &&
    data.length === 3 &&
    [
      'sign-in',
      'recovery',
      'sign-up',
      'verification',
      'settings',
      'logout',
    ].indexOf(currentFlow) !== -1
  ) {
    let headers: Headers = new Headers();

    // @ts-ignore
    // Hackerman: This is because of the axios response result something weird which we can't access it uses symbols
    // So this is hack probably issue in the @haverstack/axios-fetch-adapter lib
    kratosClient.axios.defaults.adapter = createFetchAdapter({
      fetch: (...args) => {
        return fetch(...args).then((docs) => {
          headers = docs.headers;
          return docs;
        });
      },
    });

    const cookie = request.headers.get('cookie') ?? undefined;
    const returnUrl =
      url.searchParams.get('return-url') ??
      url.searchParams.get('return_to') ??
      undefined;

    const loginChallege = url.searchParams.get('login-challenge') ?? undefined;
    let refresh = url.searchParams.get('refresh') === 'true';

    let session: Session | null = null;

    if (cookie && cookie.indexOf('session') !== -1) {
      try {
        session = await kratosClient
          .toSession({
            cookie: cookie,
          })
          .then((docs) => docs.data);

        refresh = true;
      } catch (e) {}
    }

    try {
      let flow:
        | AxiosResponse<
            | LoginFlow
            | RegistrationFlow
            | RecoveryFlow
            | VerificationFlow
            | SettingsFlow
          >
        | undefined;

      switch (currentFlow) {
        case 'sign-in':
          flow = (await kratosClient.createBrowserLoginFlow({
            returnTo: returnUrl,
            refresh: refresh,
            aal: url.searchParams.get('aal') ?? undefined,
            cookie: cookie,
            loginChallenge: loginChallege,
          })) as AxiosResponse<LoginFlow>;
          break;
        case 'recovery':
          flow = (await kratosClient.createBrowserRecoveryFlow(
            {
              returnTo: returnUrl,
            },
            {
              headers: {
                cookie: cookie,
              },
            },
          )) as AxiosResponse<RecoveryFlow>;
          break;
        case 'sign-up':
          flow = (await kratosClient.createBrowserRegistrationFlow(
            {
              returnTo: returnUrl,
              loginChallenge: loginChallege,
            },
            {
              headers: {
                cookie: cookie,
              },
            },
          )) as AxiosResponse<RegistrationFlow>;
          break;
        case 'verification':
          flow = (await kratosClient.createBrowserVerificationFlow(
            {
              returnTo: returnUrl,
            },
            {
              headers: {
                cookie,
              },
            },
          )) as AxiosResponse<VerificationFlow>;
          break;
        case 'settings':
          if (!session) {
            return NextResponse.redirect(
              `${url.protocol}${request.headers.get(
                'host',
              )}/v1/sign-in?return-url=${encodeURIComponent(url.toString())}`,
            );
          }

          flow = (await kratosClient.createBrowserSettingsFlow({
            returnTo: returnUrl,
            cookie: cookie,
          })) as AxiosResponse<SettingsFlow>;
      }
      if (flow) {
        url.searchParams.set('flow', flow.data.id);
        if ((flow.data as LoginFlow).requested_aal) {
          url.searchParams.set('aal', (flow.data as LoginFlow).requested_aal!);
        }
        if (flow.data.return_to) {
          url.searchParams.set('return-url', flow.data.return_to);
        }

        const resp = NextResponse.redirect(url);

        const value = headers.get('set-cookie');
        if (value) {
          resp.headers.set('set-cookie', value);
        }

        return resp;
      }
    } catch (e) {
      console.error(e);
      throw new Error('Internal server error');
    }
  }

  return response;
}

export const config = {
  matcher: '/v1/(sign-in|sign-up|recovery|settings|verification|logout)',
};
