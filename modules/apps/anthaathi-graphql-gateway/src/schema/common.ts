import { builder } from './index';

builder.queryType({
  fields: (t) => ({}),
});

builder.mutationType({
  fields: (t) => ({}),
});

const ErrorInterface = builder.interfaceRef<Error>('Error').implement({
  fields: (t) => ({
    message: t.exposeString('message'),
  }),
});

builder.objectType(Error, {
  name: 'BaseError',
  interfaces: [ErrorInterface],
});
