require('dotenv').config({
  path: './env.local',
});

module.exports = {
  client: {
    includes: ['**/*.tsx'],
    service: {
      name: 'github',
      url: process.env.GRAPHQL_URL,
      headers: {
        'x-hasura-admin-secret': process.env.GRAPHQL_SECRET,
      },
      // optional disable SSL validation check
      skipSSLValidation: true,
    },
  },
};
