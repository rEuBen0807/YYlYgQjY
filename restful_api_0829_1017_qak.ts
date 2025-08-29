// 代码生成时间: 2025-08-29 10:17:40
import { ApolloServer, gql } from 'apollo-server-express';
import express from 'express';
import { buildSchema } from 'type-graphql';
import { ObjectType, Field, ID } from 'type-graphql';
import { createConnection } from 'typeorm';
import { User } from './entity/User'; // Assuming User entity is defined in entity/User.ts

// Define the User type with GraphQL
@ObjectType()
class UserType {
  @Field(type => ID)
  id: number;

  @Field()
  name: string;
}

// Define the Resolver
const resolvers = {
  Query: {
    getUser: async (_, args: { id: number }) => {
      try {
        const user = await User.findOne(args.id);
        if (!user) {
          throw new Error('User not found');
        }
        return user;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
};

// Define the schema
const schema = await buildSchema({
  resolvers,
  validate: false,
});

// Initialize the ApolloServer with the schema
const server = new ApolloServer({
  schema,
  context: () => ({
    // Add authentication logic or other context here if needed
  })
});

// Create an Express app
const app = express();

// Apply JSON middleware
app.use(express.json());

// Apply GraphQL middleware
server.applyMiddleware({ app });

// Start the server
app.listen({ port: 4000 }, () => {
  console.log("🚀 Server ready at http://localhost:4000/");
  console.log("[90mℹ️  See https://pris.ly/d/graphql/naming for advanced tips and naming best practices.\u001b[0m");
});

// Export the app for testing
export { app };

// Example of a GraphQL query to fetch a user by ID
// query {
//   getUser(id: 1) {
//     id
//     name
//   }
// }