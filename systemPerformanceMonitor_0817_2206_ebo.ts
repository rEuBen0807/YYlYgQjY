// 代码生成时间: 2025-08-17 22:06:48
import { ApolloServer } from 'apollo-server';
import { GraphQLSchema } from 'graphql';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { performanceTypeDefs } from './performanceTypeDefs';
import { performanceResolvers } from './performanceResolvers';
import { PerformanceMetrics } from './performanceMetrics';

// Define the type definitions for the GraphQL schema
const typeDefs = [performanceTypeDefs];

// Create an executable GraphQL schema
const schema: GraphQLSchema = makeExecutableSchema({
  typeDefs,
  resolvers: performanceResolvers,
});

// Create an Apollo Server instance
const server = new ApolloServer({
  schema,
  context: () => ({}),
  formatError: (error) => {
    // Custom error handling
    console.error(error);
    return error;
  },
});

// Define the main function to start the server
async function startServer() {
  try {
    await server.listen({
      port: 4000,
    }).then(({ url }) => {
      console.log(`Server is running, GraphQL Playground available at ${url}`);
    });
  } catch (error) {
    console.error('Failed to start the server:', error);
  }
}

// Start the server
startServer();

// Export the PerformanceMetrics class for use in resolvers
export class PerformanceMetrics {
  public async getSystemMetrics(): Promise<string> {
    // Placeholder for system metrics fetching logic
    return 'System performance metrics';
  }
}
