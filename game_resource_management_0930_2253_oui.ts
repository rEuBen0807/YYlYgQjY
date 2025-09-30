// 代码生成时间: 2025-09-30 22:53:53
import { ApolloServer } from 'apollo-server';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { addResolversToSchema } from '@graphql-tools/schema';

// Define the type definitions for the GraphQL schema
const typeDefs = `
  type Resource {
    id: ID!
    name: String!
    quantity: Int!
  }

  type Query {
    getResources: [Resource]
    getResource(id: ID!): Resource
  }

  type Mutation {
    addResource(name: String!, quantity: Int!): Resource
    updateResource(id: ID!, quantity: Int!): Resource
    deleteResource(id: ID!): Boolean
  }
`;

// Mock database for storing resources
const resourcesDB: {[id: string]: {name: string, quantity: number}} = {};

// Resolver map
const resolvers = {
  Query: {
    getResources: () => Object.values(resourcesDB),
    getResource: (_, { id }) => resourcesDB[id] || null,
  },
  Mutation: {
    addResource: (_, { name, quantity }) => {
      const id = Date.now().toString();
      resourcesDB[id] = { name, quantity };
      return { id, name, quantity };
    },
    updateResource: (_, { id, quantity }) => {
      if (!resourcesDB[id]) {
        throw new Error('Resource not found');
      }
      resourcesDB[id].quantity = quantity;
      return resourcesDB[id];
    },
    deleteResource: (_, { id }) => {
      if (!resourcesDB[id]) {
        throw new Error('Resource not found');
      }
      delete resourcesDB[id];
      return true;
    },
  },
};

// Create the GraphQL schema
const schema = makeExecutableSchema({ typeDefs, resolvers });

// Set up the Apollo Server
const server = new ApolloServer({ schema });

// Start the server
server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
