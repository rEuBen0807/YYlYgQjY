// 代码生成时间: 2025-08-15 11:36:05
import { ApolloServer, gql } from 'apollo-server';
import { AuthenticationError } from 'apollo-server-errors';

// 定义用户类型
const typeDefs = gql`
  type Query {
    login(username: String!, password: String!): AuthenticationResult
  }
  type AuthenticationResult {
    success: Boolean
    message: String
    token: String
  }
`;

// 模拟用户数据库
interface User {
  username: string;
  password: string;
  token: string;
}

// 模拟一个用户数据库
const users: User[] = [
  { username: 'user1', password: 'pass1', token: 'token1' },
  { username: 'user2', password: 'pass2', token: 'token2' },
];

// 定义登录函数
const resolvers = {
  Query: {
    login: async (_, { username, password }) => {
      const user = users.find(u => u.username === username && u.password === password);
      if (!user) {
        throw new AuthenticationError('Invalid username or password');
      }
      return {
        success: true,
        message: 'Login successful',
        token: user.token,
      };
    },
  },
};

// 创建 Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // 可以在这里添加额外的上下文信息，例如从请求中提取用户信息
    return {};
  },
});

// 启动服务器
server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});