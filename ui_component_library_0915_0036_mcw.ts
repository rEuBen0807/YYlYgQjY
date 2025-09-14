// 代码生成时间: 2025-09-15 00:36:29
import { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLNonNull } from 'graphql';

// Define the GraphQL queries
const typeDefs = `
  type Query {
    getComponent(name: String!): Component
  }

  type Component {
    name: String
    description: String
  }
`;

// Mock data for components
const components = {
  button: {
    name: 'button',
    description: 'A clickable button component'
  },
  input: {
    name: 'input',
    description: 'A text input component'
  }
  // ...other components
};

// Define the resolvers
const resolvers = {
  Query: {
    getComponent: (_, { name }) => {
      if (name in components) {
        return components[name];
      } else {
        throw new Error('Component not found');
      }
    }
  }
};

// Create the GraphQL schema
const schema = new GraphQLSchema({
  typeDefs,
  resolvers
});

// Export the schema for use in a GraphQL server
export { schema };
