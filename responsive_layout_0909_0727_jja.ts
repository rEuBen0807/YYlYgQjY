// 代码生成时间: 2025-09-09 07:27:43
// Import necessary dependencies
import { GraphQLServer } from 'graphql-yoga';
import { typeDefs } from './typedefs'; // Assuming type definitions are in a separate file
import { resolvers } from './resolvers'; // Assuming resolvers are in a separate file

// Define the GraphQL server with type definitions and resolvers
const server = new GraphQLServer({

  typeDefs,

  resolvers

});

// Start the server
const startServer = async () => {

  try {

    // Listen on port 4000 for incoming requests

    await server.start({

      endpoint: '/graphql',

      port: 4000,

      playground: true, // Enable GraphQL playground for easy testing

      subscriptions: '/ws',

    });

    console.log('Server is running on http://localhost:4000/graphql');

  } catch (error) {

    // Handle any errors that occur during server start

    console.error('Failed to start the server:', error);

  }

};

// Call the server start function to initiate the GraphQL server

startServer();

