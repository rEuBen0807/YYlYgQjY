// 代码生成时间: 2025-09-06 17:49:24
import { ApolloServer, gql } from 'apollo-server';
import { InMemoryLRUCache } from 'apollo-server-caching';

// Define the type definitions for our GraphQL schema
const typeDefs = gql`
  type Query {
    cart: [Product]
  }
  type Mutation {
    addToCart(productId: ID!): Product
    removeFromCart(productId: ID!): Product
  }
  type Product {
    id: ID!
    name: String!
    price: Float!
    quantity: Int
  }
`;

// Mock data for products
const products = [
  { id: '1', name: 'Laptop', price: 999.99, quantity: 0 },
  { id: '2', name: 'Smartphone', price: 499.99, quantity: 0 },
  { id: '3', name: 'Tablet', price: 299.99, quantity: 0 },
];

// In-memory cache for the cart
const cache = new InMemoryLRUCache({
  size: 100,
  ttl: 5, // 5 seconds
});

// Resolvers define the technique for fetching the types in the schema
const resolvers = {
  Query: {
    cart: () => {
      return products.map(product => ({
        ...product,
        quantity: cache.get(product.id) || 0,
      }));
    },
  },
  Mutation: {
    addToCart: (_, { productId }) => {
      const product = products.find(p => p.id === productId);
      if (!product) {
        throw new Error('Product not found');
      }
      cache.set(productId, (cache.get(productId) || 0) + 1);
      return {
        ...product,
        quantity: cache.get(productId) || 0,
      };
    },
    removeFromCart: (_, { productId }) => {
      const product = products.find(p => p.id === productId);
      if (!product) {
        throw new Error('Product not found');
      }
      const currentQuantity = cache.get(productId) || 0;
      if (currentQuantity <= 1) {
        cache.delete(productId);
      } else {
        cache.set(productId, currentQuantity - 1);
      }
      return {
        ...product,
        quantity: cache.get(productId) || 0,
      };
    },
  },
};

// Create an instance of ApolloServer with the type definitions and resolvers
const server = new ApolloServer({
  typeDefs,
  resolvers,
  cache,
  context: () => ({
    // Additional context functions can be added here
  }),
});

// Start the server
server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
