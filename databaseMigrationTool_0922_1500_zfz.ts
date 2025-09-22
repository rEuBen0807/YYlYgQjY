// 代码生成时间: 2025-09-22 15:00:37
 * Features:
 * - Clear code structure for easy understanding.
 * - Includes proper error handling.
 * - Contains necessary comments and documentation.
 * - Follows TypeScript best practices.
 * - Ensures maintainability and extensibility of the code.
 */

import { GraphQLServer } from 'graphql-yoga';
import { PrismaClient } from '@prisma/client';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { applyMiddleware } from 'graphql-middleware';
import { permissionsDirective } from './directives/permissionsDirective';

// Initialize the PrismaClient for database operations.
const prisma = new PrismaClient();

// Load all schema files from the /src/schema directory.
const typesArray = fileLoader('src/schema/**/*.graphql');

// Merge all schema files into a single schema.
const typeDefs = mergeTypes(typesArray, { all: true });

// Load all resolver files from the /src/resolvers directory.
const resolversArray = fileLoader('src/resolvers/**/*.ts');

// Merge all resolvers into a single resolver object.
const resolvers = mergeResolvers(resolversArray);

// Create the executable schema.
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  schemaDirectives: {
    permissions: permissionsDirective,
  },
});

// Apply middleware to the schema.
schema.query = applyMiddleware(schema.query, permissionsDirective);

// Create a GraphQL server instance.
const server = new GraphQLServer({
  schema,
  context: request => ({
    ...request,
    prisma, // Provide PrismaClient to the resolvers context.
  }),
});

// Define the database migration function.
async function migrateDatabase() {
  try {
    // Implement database migration logic here.
    // This is just a placeholder. Replace with actual migration code.
    console.log('Performing database migration...');
    await prisma.\$transaction(async (tx) => {
      // Example: Create a new table in the database.
      await tx.user.create({
        data: {
          name: 'John Doe',
          email: 'john.doe@example.com',
        },
      });
    });
    console.log('Database migration completed successfully.');
  } catch (error) {
    console.error('Error during database migration:', error);
    throw error;
  }
}

// Start the GraphQL server.
server.start().then(() => {
  console.log('Server is running on http://localhost:4000');
  // Perform database migration on server start.
  migrateDatabase();
});