// 代码生成时间: 2025-10-07 03:18:23
// 引入依赖
import { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLInt, GraphQLNonNull, GraphQLList } from 'graphql';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { Express } from 'express';
import cors from 'cors';

// 定义课程类型
const CourseType = new GraphQLObjectType({
  name: 'Course',
  fields: {
    id: { type: GraphQLString },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    duration: { type: GraphQLInt },
  }
});

// 模拟的课程数据
const courses = [
  { id: '1', title: 'Introduction to TypeScript', description: 'Learn TypeScript fundamentals', duration: 60 },
  { id: '2', title: 'Advanced TypeScript', description: 'Master TypeScript features', duration: 120 },
];

// 获取课程列表的查询解析器
const getCourses = {
  type: new GraphQLList(CourseType),
  resolve: () => courses,
};

// 根据ID获取课程的查询解析器
const getCourseById = {
  type: CourseType,
  args: { id: { type: new GraphQLNonNull(GraphQLString) } },
  resolve: (_, args) => courses.find(course => course.id === args.id),
};

// 定义查询类型
const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    getCourses,
    getCourseById,
  },
});

// 定义GraphQL Schema
const schema = new GraphQLSchema({
  query: QueryType,
});

// 创建Express服务器
const app: Express = express();

// 使用cors中间件处理跨域请求
app.use(cors());

// 配置GraphQL API路由
app.use('/graphql', graphqlExpress({ schema }));

// 配置GraphiQL界面路由
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

// 启动服务器
const port = 4000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
