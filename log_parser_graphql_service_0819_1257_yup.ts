// 代码生成时间: 2025-08-19 12:57:32
import { ApolloServer, gql } from 'apollo-server';
import * as fs from 'fs';
import * as path from 'path';

// GraphQL schema definition
const typeDefs = gql`
  type Query {
    parseLogFile(filePath: String!): [LogEntry]!
  }

  type LogEntry {
    timestamp: String
    level: String
    message: String
  }
`;

// Resolvers define the technique for fetching the types in the schema.
const resolvers = {
  Query: {
    parseLogFile: async (_, { filePath }) => {
      try {
        const logData = await readLogFile(filePath);
        return parseLogEntries(logData);
      } catch (error) {
        throw new Error(`Failed to parse log file: ${error.message}`);
      }
    },
  },
};

// Function to read log file content
async function readLogFile(filePath: string): Promise<string> {
  const fullPath = path.resolve(filePath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  return fs.promises.readFile(fullPath, 'utf8');
}

// Function to parse log entries from file content
function parseLogEntries(logData: string): LogEntry[] {
  const entries: LogEntry[] = [];
  const lines = logData.split('
');
  lines.forEach(line => {
    const parts = line.split(' ');
    if (parts.length >= 3) {
      const timestamp = parts[0] + ' ' + parts[1];
      const level = parts[2];
      const message = parts.slice(3).join(' ');
      entries.push({ timestamp, level, message });
    }
  });
  return entries;
}

// Define the LogEntry type for TypeScript type checking
interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
}

// Create and start the Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});
server.listen().then(({ url }) => {
  console.log(`🚀 Log parsing GraphQL service ready at ${url}`);
});
