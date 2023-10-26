import SchemaBuilder from '@pothos/core';
import PrismaPlugin from '@pothos/plugin-prisma';
import PrismaTypes from '../generated/pothos';
import RelayPlugin from '@pothos/plugin-relay';
import {
  DateResolver,
  DateTimeISOResolver,
  JSONResolver,
} from 'graphql-scalars';
import { prisma } from '../db';
import ScopeAuthPlugin from '@pothos/plugin-scope-auth';
import { Session } from '@ory/client';
import SimpleObjectsPlugin from '@pothos/plugin-simple-objects';

export const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes;
  Scalars: {
    Json: {
      Input: unknown;
      Output: unknown;
    };
    Date: {
      Input: Date;
      Output: Date;
    };
    DateTime: {
      Input: Date;
      Output: Date;
    };
  };
  Context: { session: Session };
  AuthScopes: {
    loggedIn: boolean;
    public: boolean;
  };
}>({
  plugins: [PrismaPlugin, RelayPlugin, ScopeAuthPlugin, SimpleObjectsPlugin],
  prisma: {
    client: prisma,
    exposeDescriptions: true,
    filterConnectionTotalCount: true,
  },
  relayOptions: {
    clientMutationId: 'omit',
    cursorType: 'String',
    encodeGlobalID: (type, id) =>
      `gid://Anthaathi/${encodeURIComponent(type)}/${encodeURIComponent(
        `${id}`,
      )}`,
    decodeGlobalID: (globalId) => {
      const [gid, , , type, id] = globalId.split('/');

      if (gid !== 'gid:') throw new Error(`Invalid global ID: ${globalId}`);
      if (!type || !id) throw new Error(`Invalid global ID: ${globalId}`);

      return {
        typename: decodeURIComponent(type),
        id: decodeURIComponent(id),
      };
    },
  },
  authScopes: async (context: { session: Session }) => ({
    public: true,
    loggedIn: !!context.session,
  }),
  scopeAuthOptions: {
    // Recommended when using subscriptions
    // when this is not set, auth checks are run when event is resolved rather than when the subscription is created
    authorizeOnSubscribe: true,
  },
});

builder.addScalarType('Json', JSONResolver, {});
builder.addScalarType('Date', DateResolver, {});
builder.addScalarType('DateTime', DateTimeISOResolver, {});

export type Builder = typeof builder;
