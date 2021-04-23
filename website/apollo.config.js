require('dotenv').config({
  path: './env.local',
});

// apollo schema:download --endpoint
// apollo codegen:generate ./types/graphql.d.ts --addTypename --localSchemaFile schema.json --target typescript --outputFlat

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
