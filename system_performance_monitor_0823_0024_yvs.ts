// 代码生成时间: 2025-08-23 00:24:01
import { ApolloServer, gql } from 'apollo-server';
import { CPUInfo, MemoryInfo } from 'systeminformation';

// Define the type definitions for the GraphQL schema
const typeDefs = gql"
  type Query {
    systemPerformance: SystemPerformanceData
  }

  type SystemPerformanceData {
    cpuLoad: Float
    memoryUsage: Float
  }
";

// Define the resolvers with error handling
const resolvers = {
  Query: {
    systemPerformance: async (): Promise<{ cpuLoad: number; memoryUsage: number }> => {
      try {
        const cpuInfo = await CPUInfo();
        const memoryInfo = await MemoryInfo();

        // Calculate CPU load and memory usage
        const cpuLoad = cpuInfo.currentLoad;
        const memoryUsage = memoryInfo.used / memoryInfo.total;

        return { cpuLoad, memoryUsage };
      } catch (error) {
        // Handle errors and return a user-friendly message
        throw new Error('Failed to retrieve system performance data: ' + error.message);
      }
    },
  },
};

// Create a new instance of ApolloServer with the defined typeDefs and resolvers
const server = new ApolloServer({
  typeDefs,
  resolvers,
  // Enable playground for development purposes
  playground: {
    settings: {
      'editor.cursorShape': 'line',
      'request.credentials': 'include',
    },
  },
  introspection: true,
});

// Start the server
server.listen().then(({ url }) => {
  console.log(`🚀 System Performance Monitor is ready at ${url}`);
});
