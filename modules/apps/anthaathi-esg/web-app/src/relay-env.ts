import {
  Store,
  RecordSource,
  Environment,
  Network,
  Observable,
} from 'relay-runtime';
import type { FetchFunction, IEnvironment } from 'relay-runtime';
import fetchRetry from 'fetch-retry';

const fetchWithRetry = fetchRetry(fetch, {
  retries: 5,
  retryOn: [500, 503, 504],
});

const GRAPHQL_ENDPOINT = import.meta.env.VITE_APP_GRAPHQL_ENDPOINT;

const fetchFn: FetchFunction = (params, variables) => {
  const response = fetchWithRetry(GRAPHQL_ENDPOINT ?? '/graphql', {
    method: 'POST',
    headers: [['Content-Type', 'application/json']],
    credentials: 'include',
    body: JSON.stringify({
      query: params.text,
      variables,
    }),
  });

  return Observable.from(response.then((data) => data.json()));
};

export function createEnvironment(): IEnvironment {
  const network = Network.create(fetchFn);
  const store = new Store(new RecordSource());
  return new Environment({ store, network });
}

export const relayEnv = createEnvironment();
