// 代码生成时间: 2025-08-15 07:10:36
import { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLInt, GraphQLList, GraphQLNonNull } from 'graphql';
import { graphql, GraphQLError } from 'graphql';

// Define the type for a product item in the cart
const ProductType = new GraphQLObjectType({
  name: 'Product',
  fields: {
    id: { type: GraphQLNonNull(GraphQLString) },
    name: { type: GraphQLNonNull(GraphQLString) },
    quantity: { type: GraphQLInt },
    price: { type: GraphQLFloat }
  }
});

// Define the type for the shopping cart
const CartType = new GraphQLObjectType({
  name: 'Cart',
  fields: {
    totalItems: { type: GraphQLInt },
    totalAmount: { type: GraphQLFloat },
    items: {
      type: new GraphQLList(ProductType),
      resolve: () => getCart()
    }
  }
});

// Mock database of products
const products = [
  { id: '1', name: 'Apple', price: 0.99 },
  { id: '2', name: 'Banana', price: 0.59 },
  { id: '3', name: 'Orange', price: 1.29 }
];

// Mock shopping cart
let cart = [];

// Function to get the cart
function getCart() {
  return cart;
}

// Function to add a product to the cart
function addToCart(productId: string, quantity: number) {
  const product = products.find(p => p.id === productId);
  if (!product) {
    throw new Error('Product not found');
  }
  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ ...product, quantity });
  }
}

// Root query for the GraphQL schema
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    cart: {
      type: CartType,
      resolve: () => ({ totalItems: cart.reduce((acc, item) => acc + (item.quantity || 0), 0), totalAmount: cart.reduce((acc, item) => acc + ((item.price || 0) * (item.quantity || 0)), 0), items: getCart() })
    },
    product: {
      type: ProductType,
      args: { id: { type: GraphQLNonNull(GraphQLString) } },
      resolve: (_, args) => products.find(p => p.id === args.id) || null
    }
  }
});

// Create the GraphQL schema
const Schema = new GraphQLSchema({ query: RootQuery });

// Function to execute a GraphQL query
async function executeQuery(query: string): Promise<{ data?: any, errors?: readonly GraphQLError[] }> {
  try {
    const result = await graphql(Schema, query);
    return result;
  } catch (error) {
    return { errors: [error] };
  }
}

// Example usage of the executeQuery function
const exampleQuery = `
  query {
    cart {
      totalItems
      totalAmount
      items {
        id
        name
        quantity
        price
      }
    }
  }
`;

executeQuery(exampleQuery).then(result => {
  console.log(result);
}).catch(error => {
  console.error(error);
});

// Exporting the schema for use in a GraphQL server
export { Schema };
