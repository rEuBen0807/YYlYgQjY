// 代码生成时间: 2025-09-13 21:27:06
import { ApolloServer, gql } from 'apollo-server';
import { NonEmptyArray } from 'type-graphql';

// Define the type for a CartItem
class CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;

  constructor(id: string, name: string, price: number, quantity: number) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.quantity = quantity;
  }
}

// Define the resolver type for the cart
type Cart = NonEmptyArray<CartItem>;

// Define the Shopping Cart Service
class ShoppingCartService {
  private cart: Cart = [];

  // Add item to the cart
  addItem(item: CartItem): Cart {
    const existingItemIndex = this.cart.findIndex((cartItem) => cartItem.id === item.id);
    if (existingItemIndex > -1) {
      this.cart[existingItemIndex].quantity += item.quantity;
    } else {
      this.cart.push(item);
    }
    return this.cart;
  }

  // Remove item from the cart
  removeItem(itemId: string): Cart {
    this.cart = this.cart.filter((item) => item.id !== itemId);
    return this.cart;
  }

  // Get the cart items
  getCartItems(): Cart {
    return this.cart;
  }
}

// Define the GraphQL schema
const typeDefs = gql`
  type CartItem {
    id: ID!
    name: String!
    price: Float!
    quantity: Int!
  }

  type Query {
    getCartItems: [CartItem]
  }

  type Mutation {
    addItemToCart(item: CartItemInput!): [CartItem]
    removeItemFromCart(itemId: ID!): [CartItem]
  }

  input CartItemInput {
    id: ID!
    name: String!
    price: Float!
    quantity: Int!
  }
`;

// Define the resolver functions
const resolvers = {
  Query: {
    getCartItems: async (_parent, _args, _context, _info): Promise<Cart> => {
      const cartService = new ShoppingCartService();
      return cartService.getCartItems();
    },
  },
  Mutation: {
    addItemToCart: async (_parent, args, _context, _info): Promise<Cart> => {
      const cartService = new ShoppingCartService();
      const item = new CartItem(args.item.id, args.item.name, args.item.price, args.item.quantity);
      return cartService.addItem(item);
    },
    removeItemFromCart: async (_parent, args, _context, _info): Promise<Cart> => {
      const cartService = new ShoppingCartService();
      return cartService.removeItem(args.itemId);
    },
  },
};

// Initialize the Apollo Server with the type definitions and resolvers
const server = new ApolloServer({
  typeDefs,
  resolvers,
  // Enable error logging for better debugging
  context: () => ({
    // You can add authentication or other context data here
  }),
  // Use error handling to log errors and return user-friendly messages
  formatError: (error) => {
    console.error(error);
    return error;
  },
});

// Start the server
server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});