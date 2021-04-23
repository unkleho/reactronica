import { ApolloProvider, gql, useQuery, useSubscription } from '@apollo/client';
import { client } from '../lib/apollo-client';

const SONGS = gql`
  subscription {
    songs {
      id
      name
    }
  }
`;

const GraphQLPage = () => {
  return (
    <ApolloProvider client={client}>
      <Content />
    </ApolloProvider>
  );
};

const Content = () => {
  // const { loading, error, data } = useQuery(SONGS);
  const { loading, error, data } = useSubscription(SONGS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div>
      {data.songs.map((song) => {
        return (
          <p>
            {song.id} - {song.name}
          </p>
        );
      })}
    </div>
  );
};

export default GraphQLPage;
