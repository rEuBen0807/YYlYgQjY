// 代码生成时间: 2025-08-19 04:38:03
import { ApolloServer } from 'apollo-server';
import { typeDefs } from './typeDefs';
import { resolvers } from './resolvers';

// Define the GraphQL server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  // Enable playground for development
  context: () => ({ headers: {} }),
  playground: true,
  introspection: true,
});

// Start the server
server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});

// Type definitions for the GraphQL schema
// These types represent the operations we can perform
// with our math toolbox
const typeDefs = `
  type Query {
    # Adds two numbers together
    add(x: Float!, y: Float!): Float
    # Subtracts one number from another
    subtract(x: Float!, y: Float!): Float
    # Multiplies two numbers together
    multiply(x: Float!, y: Float!): Float
    # Divides one number by another
    divide(x: Float!, y: Float!): Float
  }
`;

// Resolvers define the technique for fetching the types in the schema
const resolvers = {
  Query: {
    add: (_, { x, y }) => {
      // Basic error handling for non-numeric inputs
      if (typeof x !== 'number' || typeof y !== 'number') {
        throw new Error('Both inputs must be numbers.');
      }
      return x + y;
    },
    subtract: (_, { x, y }) => {
      if (typeof x !== 'number' || typeof y !== 'number') {
        throw new Error('Both inputs must be numbers.');
      }
      return x - y;
    },
    multiply: (_, { x, y }) => {
      if (typeof x !== 'number' || typeof y !== 'number') {
        throw new Error('Both inputs must be numbers.');
      }
      return x * y;
    },
    divide: (_, { x, y }) => {
      if (typeof x !== 'number' || typeof y !== 'number') {
        throw new Error('Both inputs must be numbers.');
      }
      if (y === 0) {
        throw new Error('Cannot divide by zero.');
      }
      return x / y;
    },
  },
};
