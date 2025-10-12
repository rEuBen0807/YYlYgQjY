// 代码生成时间: 2025-10-13 02:47:24
import { ApolloServer, gql } from 'apollo-server';
import { v4 as uuidv4 } from 'uuid';

// 定义GraphQL的类型
const typeDefs = gql`
  type Purchase {
    id: ID!
    productId: String!
    status: String!
  }

  type Query {
    "查询所有购买记录"
    purchases: [Purchase]
  }

  type Mutation {
    "创建新的购买记录"
    createPurchase(productId: String!): Purchase
  }
`;

// 定义GraphQL的解析器
const resolvers = {
  Query: {
    purchases: async () => {
      // 从数据库（这里用内存中的数组模拟）获取购买记录
      return await getPurchases();
    },
  },
  Mutation: {
    createPurchase: async (_, { productId }) => {
      try {
        const purchaseId = uuidv4();
        const purchase = { id: purchaseId, productId, status: 'PENDING' };
        await addPurchaseToDatabase(purchase);
        return purchase;
      } catch (error) {
        throw new Error('Failed to create purchase: ' + error.message);
      }
    },
  },
};

// 模拟数据库操作
const purchasesDB: Purchase[] = [];

async function getPurchases(): Promise<Purchase[]> {
  return purchasesDB;
}

async function addPurchaseToDatabase(purchase: Purchase): Promise<void> {
  purchasesDB.push(purchase);
}

// 创建Apollo服务器
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => ({
    // 如果有需要，可以在这里添加上下文（比如用户会话信息）
  }),
  formatError: (error) => {
    // 自定义错误格式，以便更好地调试和错误跟踪
    console.error(error);
    return error;
  },
});

// 启动服务器
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});

// TypeScript类型定义
interface Purchase {
  id: string;
  productId: string;
  status: string;
}
