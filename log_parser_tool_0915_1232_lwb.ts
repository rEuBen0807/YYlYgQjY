// 代码生成时间: 2025-09-15 12:32:19
import { ApolloServer } from 'apollo-server';
import { parse } from 'graphql/language/parser';
import { printSchema } from 'graphql/utilities';
import { makeExecutableSchema } from '@graphql-tools/schema';

// Define the Log Line type
type LogEntry = {
  timestamp: string;
  level: string;
  message: string;
};

// Define a function to parse a log line
function parseLogLine(line: string): LogEntry | null {
  try {
    // Assuming log line format: [timestamp][level] message
    const parts = line.trim().split(' ');
    if (parts.length < 3) return null;
    const timestamp = parts.shift();
    const level = parts.shift();
    const message = parts.join(' ');
    return { timestamp, level, message };
  } catch (error) {
    console.error('Error parsing log line:', error);
    return null;
  }
}

// Define the GraphQL schema
const typeDefs = [
  `
    type LogEntry {
      timestamp: String!
      level: String!
      message: String!
    }

    type Query {
      parseLogLine(line: String!): LogEntry
    }
  `
];

// Define the resolvers
const resolvers = {
  Query: {
    parseLogLine: (_parent, args) => parseLogLine(args.line),
  },
};

// Create the GraphQL schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// Print the schema for documentation purposes
console.log(printSchema(schema));

// Create an Apollo server instance
const server = new ApolloServer({
  schema,
  // Use the playground for development
  playground: true,
  // Enable introspection for querying the schema
  introspection: true,
});

// Start the server
server.listen().then(({ url }) => {
  console.log("Log Parser Tool is running at: {url}");
});
