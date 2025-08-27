// 代码生成时间: 2025-08-27 13:01:40
import { GraphQLServer } from 'graphql-yoga';
import { ProcessManagerResolvers } from './resolvers';
import { typeDefs } from './schema';

// Error handling middleware for the GraphQL server
const errorHandler = (err: Error): string => {
  // Log the error for debugging purposes
  console.error(err);
  // Return a generic error message to avoid exposing sensitive information
  return 'An internal server error occurred.';
};

// Create a new GraphQL server instance
const server = new GraphQLServer({
  typeDefs,
  resolvers: ProcessManagerResolvers,
  context: () => ({
    // Context can be used to pass in dependencies to resolvers
  }),
  middleware: [
    // Middleware for error handling
    {
      onContextBuilding: async (context) => {
        // Perform any necessary setup before the resolvers are called
      },
    }),
    {
      onExecute: async ({ args, context, info }) => {
        // Perform any necessary checks or transformations on the arguments
      },
    }),
    {
      onError: errorHandler,
    },
  ],
});

// Connect the server to the specified port
const start = async () => {
  try {
    await server.start({
      port: 4000,
      endpoint: '/graphql',
      playground: '/dev',
      subscriptions: '/subscriptions',
    });
    console.log('Server is running on http://localhost:4000/graphql');
  } catch (err) {
    errorHandler(err);
  }
};

// Call the start function to begin listening for requests
start();

export default server;
