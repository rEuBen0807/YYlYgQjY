// 代码生成时间: 2025-08-08 15:03:06
import { ApolloServer, gql } from 'apollo-server';
import { PrismaClient } from '@prisma/client';

// Define a GraphQL schema
const typeDefs = gql`
  type Query {
    " Get a user by their ID, which is safe from SQL injection "
    getUserById(id: ID!): User
  }

t  type User {
    id: ID!
    name: String
  }
`;

// Resolvers define the technique for fetching the types in the schema.
const resolvers = {
  Query: {
    getUserById: async (_, { id }, { prisma }) => {
      // Error handling for non-existent user
      const user = await prisma.user.findUnique({
        where: { id: parseInt(id) },
      });
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    },
  },
};

// Set up the Apollo server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => ({
    // PrismaClient is used for database interactions
    prisma: new PrismaClient(),
  }),
});

// Start the server
server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

/*
 * Note: This code uses the Prisma Client to interact with the database.
 * Prisma Client uses parameterized queries or prepared statements,
 * which inherently prevent SQL injection.
 */