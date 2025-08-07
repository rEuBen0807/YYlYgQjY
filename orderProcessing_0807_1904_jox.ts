// 代码生成时间: 2025-08-07 19:04:02
import { ApolloServer, gql } from 'apollo-server';
import { GraphQLError } from 'graphql';

// Define the type for an Order
interface Order {
  id: string;
  status: string;
}

// Mock database of orders
const orders: Order[] = [
  { id: '1', status: 'Pending' },
  { id: '2', status: 'Shipped' },
  { id: '3', status: 'Delivered' },
];

// Type definitions for the GraphQL schema
const typeDefs = gql`
  type Order {
    id: ID!
    status: String!
  }

  type Query {
    orders: [Order]
    order(id: ID!): Order
  }

  type Mutation {
    createOrder(status: String!): Order
    updateOrderStatus(id: ID!, status: String!): Order
  }
`;

// Resolvers define the technique for fetching the types in the schema.
const resolvers = {
  Query: {
    orders: () => orders,
    order: (_, { id }) => orders.find(order => order.id === id),
  },
  Mutation: {
    createOrder: (_, { status }) => {
      // Generate a unique ID for the new order
      const newOrder: Order = {
        id: (Math.random() * 1000).toString(),
        status: status,
      };
      // Add the new order to the mock database
      orders.push(newOrder);
      return newOrder;
    },
    updateOrderStatus: (_, { id, status }) => {
      const orderIndex = orders.findIndex(order => order.id === id);
      if (orderIndex === -1) {
        throw new Error('Order not found');
      }
      orders[orderIndex].status = status;
      return orders[orderIndex];
    },
  },
};

// Error handling for GraphQL server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (error: Error) => {
    if (error instanceof GraphQLError) {
      return error;
    }
    console.error('Unhandled error:', error);
    return new GraphQLError('An unexpected error occurred.');
  },
});

// Start the GraphQL server
server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
