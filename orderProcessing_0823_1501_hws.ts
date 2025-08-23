// 代码生成时间: 2025-08-23 15:01:58
import { ApolloServer, gql } from 'apollo-server';
import { GraphQLError } from 'graphql';

// Define the type of data for an Order
interface OrderType {
  id: string;
  status: string;
  items: Array<{ id: string; name: string; quantity: number }>;
}

// Sample order data
const ORDERS: OrderType[] = [
  { id: '1', status: 'pending', items: [{ id: 'a', name: 'Item A', quantity: 2 }] },
  { id: '2', status: 'shipped', items: [{ id: 'b', name: 'Item B', quantity: 3 }] },
];

// Resolvers define the technique for fetching the types in the schema.
const resolvers = {
  Query: {
    orders: () => ORDERS,
    order: (_: any, { id }: { id: string }) => ORDERS.find((order) => order.id === id),
  },
  Mutation: {
    updateOrderStatus: (_: any, { id, newStatus }: { id: string; newStatus: string }) => {
      const order = ORDERS.find((order) => order.id === id);
      if (!order) {
        throw new Error('Order not found');
      }
      order.status = newStatus;
      return order;
    },
    addOrderItem: (_: any, { orderId, itemId, quantity }: { orderId: string; itemId: string; quantity: number }) => {
      const order = ORDERS.find((order) => order.id === orderId);
      if (!order) {
        throw new Error('Order not found');
      }
      const item = order.items.find((item) => item.id === itemId);
      if (item) {
        item.quantity += quantity;
      } else {
        order.items.push({ id: itemId, name: '', quantity: quantity });
      }
      return order;
    },
  },
};

// Construct a schema, using GraphQL schema language
const typeDefs = gql"""
  type Order {
    id: ID!
    status: String!
    items: [Item!]!
  }
  type Item {
    id: ID!
    name: String
    quantity: Int!
  }
  type Query {
    orders: [Order!]!
    order(id: ID!): Order
  }
  type Mutation {
    updateOrderStatus(id: ID!, newStatus: String!): Order
    addOrderItem(orderId: ID!, itemId: ID!, quantity: Int!): Order
  }
""";

// Initialize the ApolloServer with the schema and resolvers
const server = new ApolloServer({ typeDefs, resolvers });

// Start the server by listening on port 4000
server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});