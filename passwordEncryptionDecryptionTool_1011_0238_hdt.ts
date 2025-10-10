// 代码生成时间: 2025-10-11 02:38:21
import { ApolloServer, gql } from 'apollo-server';
import { scrypt } from 'crypto';
import { promisify } from 'util';

// Promisified scrypt functions for easier async usage.
const scryptAsync = promisify(scrypt);

// GraphQL type definitions.
const typeDefs = gql`
  type Query {
    "Encrypt a password."
    encryptPassword(password: String!): String
    "Decrypt an encrypted password."
    decryptPassword(encryptedPassword: String!): String
  }
`;

// GraphQL resolvers.
const resolvers = {
  Query: {
    encryptPassword: async (_, args) => {
      try {
        const { password } = args;
        // Encrypt the password using scrypt.
        const encrypted = await scryptAsync(password, 'salt', 64);
        return encrypted.toString('hex');
      } catch (error) {
        throw new Error('Failed to encrypt password: ' + error.message);
      }
    },
    decryptPassword: async (_, args) => {
      try {
        const { encryptedPassword } = args;
        // Decrypt the password using scrypt.
        const encrypted = Buffer.from(encryptedPassword, 'hex');
        const decrypted = await scryptAsync(encrypted, 'salt', 64, {
          N: 1024,
          r: 1,
          p: 1
        });
        return decrypted.toString();
      } catch (error) {
        throw new Error('Failed to decrypt password: ' + error.message);
      }
    }
  }
};

// Create Apollo Server instance.
const server = new ApolloServer({ typeDefs, resolvers });

// Start the server.
server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});