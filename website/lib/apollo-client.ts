import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { split } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';

const httpLink = createHttpLink({
  uri: process.env.GRAPHQL_URL,
});

const wsLink = process.browser
  ? new WebSocketLink({
      uri: process.env.GRAPHQL_WS_URL,
      options: {
        reconnect: true,
        connectionParams: {
          headers: {
            'x-hasura-admin-secret': process.env.GRAPHQL_SECRET,
          },
        },
      },
    })
  : null;

const authLink = setContext((_, { headers }) => {
  const secret = process.env.GRAPHQL_SECRET;

  return {
    headers: {
      ...headers,
      'x-hasura-admin-secret': secret,
    },
  };
});

const splitLink = process.browser
  ? split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === 'OperationDefinition' &&
          definition.operation === 'subscription'
        );
      },
      wsLink,
      authLink.concat(httpLink),
    )
  : authLink.concat(httpLink);

export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});
