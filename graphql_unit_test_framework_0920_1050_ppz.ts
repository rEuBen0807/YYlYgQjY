// 代码生成时间: 2025-09-20 10:50:47
import { ApolloServer } from 'apollo-server';
import { gql } from 'apollo-server';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { addMocksToSchema } from '@graphql-tools/mock';
import { TestSchemaConfig } from '@graphql-tools/utils';

// Define the GraphQL schema using GraphQL Schema Language (GSL)
const typeDefs = gql"""
  type Query {
    users: [User]
    user(id: ID!): User
  }

  type User {
    id: ID!
    name: String
    email: String
  }
""";

// Mock data for testing
const users = [{ id: '1', name: 'John Doe', email: 'john@example.com' }];

// Mock resolvers for the schema
const resolvers: TestSchemaConfig = {
  Query: {
    users: () => users,
    user: (_parent, { id }) => users.find(user => user.id === id),
  },
};

// Create an executable schema with mock data
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// Add mocks to the schema for testing
const mockedSchema = addMocksToSchema({
  schema,
  mocks: {
    ID: () => '1',
    String: () => 'mocked string',
  },
});

// Create an Apollo Server instance with the mocked schema
const server = new ApolloServer({ schema: mockedSchema });

// Start the server
server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});

// Export the server for use in tests
export default server;