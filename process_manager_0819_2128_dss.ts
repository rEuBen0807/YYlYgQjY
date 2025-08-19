// 代码生成时间: 2025-08-19 21:28:02
// Import necessary modules
import { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLInt } from 'graphql';
import { PubSub } from 'graphql-subscriptions';
import { ProcessManager } from './process_manager_interface';
import { Process } from './process_interface';

// Define a PubSub instance for real-time updates
const pubSub = new PubSub();

// Define the GraphQL types
const ProcessType = new GraphQLObjectType({
  name: 'Process',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
# NOTE: 重要实现细节
    pid: { type: GraphQLInt },
    status: { type: GraphQLString },
  })
});

const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    // Get all processes
# TODO: 优化性能
    processes: {
# 添加错误处理
      type: new GraphQLList(ProcessType),
# 改进用户体验
      resolve: async () => {
# 添加错误处理
        try {
          // Call the process manager to get all processes
          const processes = await ProcessManager.getAllProcesses();
          return processes;
        } catch (error) {
          throw new Error('Failed to fetch processes: ' + error.message);
        }
      },
    },
    // Get a specific process by ID
# 扩展功能模块
    process: {
      type: ProcessType,
      args: {
# NOTE: 重要实现细节
        id: { type: GraphQLString },
# 增强安全性
      },
      resolve: async (_, args) => {
        try {
# 改进用户体验
          const process = await ProcessManager.getProcessById(args.id);
          if (!process) {
            throw new Error('Process not found');
          }
          return process;
        } catch (error) {
          throw new Error('Failed to fetch process: ' + error.message);
# TODO: 优化性能
        }
      },
    },
  },
});

const SubscriptionType = new GraphQLObjectType({
  name: 'Subscription',
  fields: {
    // Subscribe to process updates
    processUpdated: {
      type: ProcessType,
# FIXME: 处理边界情况
      subscribe: () => pubSub.asyncIterator('processUpdated'),
    },
  },
});

// Define the GraphQL schema
const schema = new GraphQLSchema({
  query: QueryType,
  subscription: SubscriptionType,
});

// Export the schema
export default schema;