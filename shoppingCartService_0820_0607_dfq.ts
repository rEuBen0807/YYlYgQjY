// 代码生成时间: 2025-08-20 06:07:35
// 引入必要的依赖和GraphQL类型 
import {
  GraphQLObjectType, 
  GraphQLString, 
  GraphQLInt, 
  GraphQLList, 
  GraphQLNonNull, 
  GraphQLSchema, 
} from 'graphql';

// 定义购物车商品类型
const CartItemType = new GraphQLObjectType({
  name: 'CartItem',
  fields: {
    id: { type: GraphQLNonNull(GraphQLString) },
    name: { type: GraphQLNonNull(GraphQLString) },
    quantity: { type: GraphQLNonNull(GraphQLInt) },
  },
});

// 定义购物车类型
const CartType = new GraphQLObjectType({
  name: 'Cart',
  fields: {
    items: {
      type: new GraphQLList(CartItemType),
      resolve: (source) => source.items,
    },
    totalQuantity: {
      type: GraphQLNonNull(GraphQLInt),
      resolve: (source) => source.items.reduce((total, item) => total + item.quantity, 0),
    },
    totalCost: {
      type: GraphQLNonNull(GraphQLString),
      resolve: (source) => source.items.reduce((total, item) => total + item.quantity * item.price, 0).toFixed(2),
    },
  },
});

// 定义添加商品到购物车的函数
function addItemToCart(cart, item) {
  // 检查商品是否已存在购物车中
  let existingItem = cart.items.find((cartItem) => cartItem.id === item.id);
  if (existingItem) {
    // 如果商品已存在，则增加数量
    existingItem.quantity += item.quantity;
  } else {
    // 如果商品不存在，则添加新商品
    cart.items.push(item);
  }
  return cart;
}

// 定义GraphQL Query和Mutation类型
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    cart: {
      type: CartType,
      resolve: () => {
        return {
          items: [],
        };
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addToCart: {
      type: CartType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        quantity: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve: (_, args) => {
        const cart = {
          items: [],
        };
        return addItemToCart(cart, {
          id: args.id,
          name: args.name,
          quantity: args.quantity,
          price: parseFloat(args.price || '0.00'), // 假设价格为0.00
        });
      },
    },
  },
});

// 创建GraphQL Schema
const Schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});

// 导出Schema
export default Schema;