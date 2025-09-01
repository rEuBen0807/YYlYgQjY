// 代码生成时间: 2025-09-02 07:38:59
import { ApolloServer } from 'apollo-server';
import { gql } from 'apollo-server';
import { Process } from './models/Process';
import { ProcessType } from './types/ProcessType';

// 定义GraphQL schema
const typeDefs = gql"""
  type Query {
    getProcesses: [Process]
    killProcess(taskId: Int!): Process
  }

  type Mutation {
    startProcess(command: String!): Process
    restartProcess(taskId: Int!): Process
  }

  type Process {
    id: Int
    pid: Int
    command: String
    status: ProcessType
  }
""";

// 定义resolvers
const resolvers = {
  Query: {
    getProcesses: async () => {
      try {
        // 模拟获取进程列表
        return Process.list();
      } catch (error) {
        throw new Error('Failed to fetch processes');
      }
    },
    killProcess: async (_, { taskId }) => {
      try {
        // 模拟杀死进程
        const killedProcess = await Process.kill(taskId);
        return killedProcess;
      } catch (error) {
        throw new Error('Failed to kill process');
      }
    },
  },
  Mutation: {
    startProcess: async (_, { command }) => {
      try {
        // 模拟启动进程
        const newProcess = await Process.start(command);
        return newProcess;
      } catch (error) {
        throw new Error('Failed to start process');
      }
    },
    restartProcess: async (_, { taskId }) => {
      try {
        // 模拟重启进程
        const restartedProcess = await Process.restart(taskId);
        return restartedProcess;
      } catch (error) {
        throw new Error('Failed to restart process');
      }
    },
  },
};

// 启动ApolloServer
const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});

// Process model模拟
class Process {
  static list(): Process[] {
    // 模拟进程列表
    return [
      { id: 1, pid: 1234, command: 'node app.js', status: 'RUNNING' },
      { id: 2, pid: 5678, command: 'python script.py', status: 'SLEEPING' },
    ];
  }

  static async start(command: string): Promise<Process> {
    // 模拟启动进程
    return { id: 3, pid: 9012, command, status: 'RUNNING' };
  }

  static async kill(taskId: number): Promise<Process> {
    // 模拟杀死进程
    return { id: taskId, pid: 3456, command: 'node app.js', status: 'TERMINATED' };
  }

  static async restart(taskId: number): Promise<Process> {
    // 模拟重启进程
    return { id: taskId, pid: 7890, command: 'node app.js', status: 'RUNNING' };
  }
}

// Process type枚举
enum ProcessType {
  RUNNING = 'RUNNING',
  SLEEPING = 'SLEEPING',
  TERMINATED = 'TERMINATED',
}
