import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import fetch from 'node-fetch';
import ws from 'ws';

// Create an http link:
const httpLink = new HttpLink({
  uri: process.env.GRAPHQL_URL,
  fetch,
});

// Create a WebSocket link:
const wsLink = new WebSocketLink({
  uri: process.env.GRAPHQL_SUBSCRIPTION_URL,
  options: {
    reconnect: true,
  },
  ...(process.browser
    ? {}
    : {
        webSocketImpl: ws,
      }),
});

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  // link: process.browser ? link : httpLink,
  link,
  cache: new InMemoryCache(),
  ssrMode: true,
});

export default client;
