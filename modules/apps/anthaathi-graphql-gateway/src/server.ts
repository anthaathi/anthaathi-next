import { createYoga } from 'graphql-yoga';
import { createServer } from 'node:http';
import { builder } from './schema';
import { GraphQLError } from 'graphql';
import { initContextCache } from '@pothos/core';
import oryClient from './utils/ory-client';
import { Session } from '@ory/client';
import opentelemetry from '@opentelemetry/api';
import { useOpenTelemetry } from '@envelop/opentelemetry';
import { isDev } from './utils/is-dev';
import { useDisableIntrospection } from '@graphql-yoga/plugin-disable-introspection';

import './schema/customer';
import './schema/organization';
import './schema/project';
import './schema/task';
import './schema/user';
import './schema/common';
import './schema/globalsearch';

const schema = builder.toSchema();

const yoga = createYoga({
  schema,
  landingPage: false,
  graphiql: isDev,
  plugins: [
    useOpenTelemetry(
      {
        resolvers: true, // Tracks resolvers calls, and tracks resolvers thrown errors
        variables: true, // Includes the operation variables values as part of the metadata collected
        result: true, // Includes execution result object as part of the metadata collected
      },
      opentelemetry.trace,
    ),
    process.env.NODE_ENV === 'production' && useDisableIntrospection({}),
  ],
  maskedErrors: {
    isDev: process.env.NODE_ENV !== 'production',
    maskError:
      process.env.NODE_ENV !== 'production'
        ? (error, message, isDev) => {
            if (error instanceof GraphQLError) {
              return error as never;
            }

            console.log(error);

            if (isDev) {
              return error as never;
            }

            console.error(error);

            return new GraphQLError('Internal server error');
          }
        : undefined,
  },
  context: async (req) => {
    const cookie = req.request.headers.get('cookie');
    const xSessionToken = req.request.headers.get('x-session-token');

    let session: Session | null = null;

    if (cookie || xSessionToken) {
      session = await oryClient
        .toSession({
          cookie: cookie!,
          xSessionToken: xSessionToken!,
        })
        .then((docs) => {
          return docs.data;
        })
        .catch((e) => {
          if (e.response?.data?.error?.code === 401) {
            throw new GraphQLError('Unauthorized');
          }
          throw e;
        });
    }

    return {
      ...initContextCache(),
      session,
    };
  },
});

const server = createServer(yoga);

const port = process.env.PORT || 8677;

server.listen(+port, () => {
  console.log(`Visit http://localhost:${port}/graphql`);
});

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err);
});
