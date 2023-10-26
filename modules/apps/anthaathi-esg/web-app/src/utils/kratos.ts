import { Configuration, FrontendApi } from '@ory/kratos-client';

const URL = import.meta.env.VITE_ORY_SDK_URL;

// eslint-disable-next-line import/no-anonymous-default-export
export default new FrontendApi(
  new Configuration({
    //https://vitejs.dev/guide/env-and-mode.html#env-files
    basePath:
      URL ?? typeof window === 'undefined'
        ? 'http://localhost:4433'
        : 'http://accounts.anthaathi.localhost:4443',
    // we always want to include the cookies in each request
    // cookies are used for sessions and CSRF protection
    baseOptions: {
      withCredentials: true,
    },
  })
);
