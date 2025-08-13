// 代码生成时间: 2025-08-14 05:51:59
import { createServer } from 'graphql-yoga';
import { PrismaClient } from '@prisma/client';
import { fileLoader, mergeTypes } from 'merge-graphql-schemas';
import path from 'path';
import fs from 'fs';
import archiver from 'archiver';
import { promisify } from 'util';
import { pipeline } from 'stream';
import { createWriteStream } from 'fs';

// Define the GraphQL schema for the unzip tool
const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './schema/*.graphql')));

// Define the resolvers for the GraphQL schema
const resolvers = {
  Query: {
    extractFiles: async (_, { filePath, outputDirectory }) => {
      try {
        const archivePath = path.join(__dirname, filePath);
        const outputPath = path.join(__dirname, outputDirectory);

        // Check if the archive file exists
        if (!fs.existsSync(archivePath)) {
          throw new Error('Archive file not found');
        }

        // Create a write stream for the output directory
        const output = createWriteStream(path.join(outputPath, 'extracted.zip'));

        // Create an archiver instance
        const archive = archiver('zip');

        // Listen for all archive data to be written
        const finish = promisify(archive.finalize).bind(archive);

        // Pipe the archiver to the output stream
        await pipeline(archive, output, async (err) => {
          if (err) {
            throw new Error('Failed to extract files');
          }
        });

        // Add the archive file to the archiver
        archive.file(archivePath, { name: 'archive.zip' });

        // Finalize the archive
        await finish();

        return `Files extracted to ${outputPath}`;
      } catch (error) {
        console.error('Error extracting files:', error);
        throw new Error('Failed to extract files');
      }
    },
  },
};

// Create a new Prisma client instance
const prisma = new PrismaClient();

// Create the GraphQL server
const server = createServer({
  typeDefs,
  resolvers,
  context: {
    prisma,
  },
});

// Start the GraphQL server
server.start().then(({ url }) => {
  console.log(`Server is running at ${url}`);
}).catch((err) => {
  console.error('Failed to start server:', err);
});