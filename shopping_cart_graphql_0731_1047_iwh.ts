// 代码生成时间: 2025-07-31 10:47:53
import { ApolloServer, gql } from 'apollo-server';
import { InMemoryLRUCache } from 'apollo-server-caching';
import { mergeResolvers } from 'merge-graphql-schemas';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { stitchingDirectives } from '@graphql-tools/stitching-directives';
import { stitchingSchema } from './stitchingSchema';
import { resolvers as cartResolvers } from './cartResolvers';
import { resolvers as itemResolvers } from './itemResolvers';

// GraphQL schema definition for shopping cart
const typeDefs = gql`
  type Cart {
    id: ID!
    items: [CartItem]
  }

  type CartItem {
    productId: ID!
    quantity: Int!
  }

  type Product {
    id: ID!
    name: String!
    price: Float!
  }

  extend type Query {
    getCart: Cart
  }

  extend type Mutation {
    addItemToCart(productId: ID!, quantity: Int!): Cart
    removeItemFromCart(productId: ID!): Cart
  }
`;

// In-memory cache for storing cart data
const cache = new InMemoryLRUCache();

// Initialize Apollo Server with GraphQL schema and resolvers
const server = new ApolloServer({
  typeDefs,
  resolvers: mergeResolvers([itemResolvers, cartResolvers]),
  schemaDirectives: stitchingDirectives(),
  schema: stitchingSchema,
  context: () => ({
    cache,
  })
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

// This file should be accompanied by other files defining the resolvers and schema stitching.
// It is important to follow TypeScript best practices and maintain a clean and
// organized codebase for scalability and maintainability.
