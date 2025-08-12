// 代码生成时间: 2025-08-13 04:10:17
import { gql } from 'apollo-server-express';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { resolvers } from './resolvers'; // 导入resolvers模块
import { createServer } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';
import { SubscriptionManager } from './subscriptionManager'; // 导入SubscriptionManager
import { Server } from 'socket.io';
import { setInterval } from 'timers';
import { IResolvers } from './generated/graphql'; // 导入GraphQL生成的类型定义

// 定义GraphQL schema
const typeDefs = gql"""
  type Query {
    tasks: [Task]
  }

  type Mutation {
    scheduleTask: Task
  }

  type Subscription {
    taskScheduled: Task
  }

  type Task {
    id: ID!
    name: String!
    description: String
    schedule: String!
  }
""";

// 创建可执行的schema
const schema = makeExecutableSchema({ typeDefs, resolvers });

// 创建HTTP服务器
const httpServer = createServer();

// 创建WebSocket服务器
const io = new Server(httpServer);
const subscriptionManager = new SubscriptionManager();

// 设置GraphQL订阅服务器
SubscriptionServer.create(
  {
    schema,
    execute,
    subscribe,
    subscriptionManager,
  },
  { server: httpServer, path: '/subscriptions' },
);

// 定时任务调度器
function scheduleTasks() {
  const interval = setInterval(() => {
    // 这里可以添加任务调度逻辑，例如从数据库获取任务并执行
    console.log("Checking for scheduled tasks...");
    // 假设我们有一个任务要执行
    const task = { id: '1', name: 'Sample Task', description: 'This is a sample task', schedule: '*/1 * * * *' };
    // 调用resolvers中的scheduleTask来触发任务
    // 这里只是演示，实际应用中应该从数据库获取任务
    resolvers.Mutation.scheduleTask(null, { task } as IResolvers['Mutation'], {
      // 上下文对象，用于传递数据库连接等
    }, (error: Error) => {
      if (error) {
        console.error("Error scheduling task: ", error.message);
      }
    });
  }, 5000); // 每5秒检查一次
  
  return interval;
}

// 启动HTTP服务器
httpServer.listen({ port: 4000 }, () => {
  console.log(`🚀 Server ready at http://localhost:4000${serverInfo}`);
  
  // 启动定时任务调度器
  const interval = scheduleTasks();
  
  // 在这里可以添加更多逻辑，例如处理关闭服务器时清除定时器
  process.on('SIGINT', () => {
    clearInterval(interval);
    console.log('Cleared interval on server shutdown');
    process.exit();
  });
});

// 导出schema和resolvers，以便其他模块使用
export { schema, resolvers };
