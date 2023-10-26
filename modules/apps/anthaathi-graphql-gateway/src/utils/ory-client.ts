import { Configuration, FrontendApi, IdentityApi } from '@ory/client';

export default new FrontendApi(
  new Configuration({
    basePath: process.env.ORY_SDK_URL || 'http://localhost:4433',
  }),
);

export const identity = new IdentityApi(
  new Configuration({
    basePath: process.env.ORY_SDK_PRIVATE_URL || 'http://localhost:4434',
  }),
);
