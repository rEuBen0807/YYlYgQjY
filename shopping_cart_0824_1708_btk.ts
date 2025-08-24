// 代码生成时间: 2025-08-24 17:08:33
import { ApolloServer } from 'apollo-server';
import { typeDefs } from './typeDefs';
import { resolvers } from './resolvers';

// Interfaces representing the data model
interface Item {
  id: string;
  name: string;
  price: number;
}

interface CartItem extends Item {
  quantity: number;
}

// Mock database of items
const items: Item[] = [
  { id: '1', name: 'Apple', price: 1.00 },
  { id: '2', name: 'Bread', price: 2.00 },
  { id: '3', name: 'Cheese', price: 3.00 },
];

// In-memory cart storage
let cart: CartItem[] = [];

// Creates a new Apollo server with the specified type definitions and resolvers
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => ({
    cart,
    items,
  })
});

// Starting the server
server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

/*
 * Type definitions for the GraphQL schema
 */
export const typeDefs = 
  `
  type Item {
    id: ID!
    name: String!
    price: Float!
  }

  type CartItem {
    item: Item!
    quantity: Int!
  }

  type Query {
    cart: [CartItem!]!
    item(id: ID!): Item
  }

  type Mutation {
    addToCart(id: ID!, quantity: Int!): CartItem
    removeFromCart(id: ID!): CartItem
    updateQuantity(id: ID!, quantity: Int!): CartItem
  }
  `;

/*
 * Resolvers for the GraphQL schema
 */
export const resolvers = {
  Query: {
    cart: () => cart,
    item: (_, { id }) => items.find(item => item.id === id),
  },
  Mutation: {
    addToCart: (_, { id, quantity }, { cart }) => {
      const item = items.find(item => item.id === id);
      if (!item) throw new Error('Item not found');
      const cartItem = cart.find(cartItem => cartItem.id === id);
      // If the item is in the cart, update the quantity
      if (cartItem) {
        cartItem.quantity += quantity;
      } else {
        cart.push({ ...item, quantity });
      }
      return { ...item, quantity };
    },
    removeFromCart: (_, { id }, { cart }) => {
      const index = cart.findIndex(cartItem => cartItem.id === id);
      if (index === -1) throw new Error('Item not found in cart');
      const removedItem = cart.splice(index, 1)[0];
      return removedItem;
    },
    updateQuantity: (_, { id, quantity }, { cart }) => {
      const cartItem = cart.find(item => item.id === id);
      if (!cartItem) throw new Error('Item not found in cart');
      cartItem.quantity = quantity;
      return cartItem;
    },
  },
};