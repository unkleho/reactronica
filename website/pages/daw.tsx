import React from 'react';
// import { ApolloProvider } from '@apollo/react-hooks';

import DAWApp from '../components/DAWApp';
import { withApollo } from '../lib/apollo';

import './daw.css';

const DAWPage = () => {
  // const { data } = useQuery(GET_SONG);

  return <DAWApp />;
};

export default withApollo(DAWPage);
