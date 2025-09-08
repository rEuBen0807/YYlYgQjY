// 代码生成时间: 2025-09-09 03:44:20
// backupSyncTool.ts

// 引入所需的库
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { promisify } from 'util';
import { createInterface } from 'readline';
import { GraphQLServer } from 'graphql-yoga';
import { typeDefs } from './backupSyncTypeDefs.graphql';
import { resolvers } from './backupSyncResolvers.ts';

// 异步函数来复制文件
async function copyFile(source: string, destination: string): Promise<void> {
  try {
    const readStream = fs.createReadStream(source);
    const writeStream = fs.createWriteStream(destination);
    readStream.pipe(writeStream);
  } catch (error) {
    throw new Error(`Failed to copy file from ${source} to ${destination}: ${error.message}`);
  }
}

// 异步函数来同步文件夹
async function syncFolder(source: string, destination: string): Promise<void> {
  try {
    const files = fs.readdirSync(source);
    for (const file of files) {
      const sourceFilePath = path.join(source, file);
      const destinationFilePath = path.join(destination, file);
      if (fs.statSync(sourceFilePath).isFile()) {
        await copyFile(sourceFilePath, destinationFilePath);
      }
    }
  } catch (error) {
    throw new Error(`Failed to sync folder from ${source} to ${destination}: ${error.message}`);
  }
}

// GraphQL服务的启动函数
async function startGraphQLServer() {
  try {
    const server = new GraphQLServer({
      typeDefs,
      resolvers,
    });

    await server.start();
    console.log(`🚀 Server is running at ${server.graphqlEndpoint}`);
  } catch (error) {
    console.error('Failed to start GraphQL server:', error.message);
  }
}

// 主函数，用于同步文件夹
async function main() {
  try {
    const sourceFolder = 'path/to/source';
    const destinationFolder = 'path/to/destination';
    await syncFolder(sourceFolder, destinationFolder);
  } catch (error) {
    console.error('FileSync Error:', error.message);
  }
}

// 启动GraphQL服务器
startGraphQLServer().then(() => main());

// 注意：上述代码中的路径 'path/to/source' 和 'path/to/destination' 需要根据实际情况进行替换。
// 注意：backupSyncTypeDefs.graphql 和 backupSyncResolvers.ts 需要根据实际情况实现。