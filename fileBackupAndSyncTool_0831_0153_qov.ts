// 代码生成时间: 2025-08-31 01:53:14
// fileBackupAndSyncTool.ts
// 这是一个使用TypeScript和GraphQL框架实现的文件备份和同步工具。

import { GraphQLSchema, graphql, GraphQLObjectType, GraphQLString, GraphQLNonNull } from 'graphql';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

// 使得fs模块的函数返回Promise，以便使用async/await
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const copyFile = promisify(fs.copyFile);

// 定义GraphQL Query类型
const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    // 获取文件内容
    fileContent: {
      type: GraphQLString,
      args: {
        filePath: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        return readFile(args.filePath, 'utf8');
      },
    },
  },
});

// 定义GraphQL Mutation类型
const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    // 备份文件
    backupFile: {
      type: GraphQLString,
      args: {
        src: { type: new GraphQLNonNull(GraphQLString) },
        dest: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        return copyFile(args.src, args.dest)
          .then(() => `File backed up from ${args.src} to ${args.dest}`)
          .catch((err) => `Error backing up file: ${err.message}`);
      },
    },
    // 同步文件
    syncFiles: {
      type: GraphQLString,
      args: {
        src: { type: new GraphQLNonNull(GraphQLString) },
        dest: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        // 检查源文件和目标文件是否存在
        const srcExists = fs.existsSync(args.src);
        const destExists = fs.existsSync(args.dest);

        if (!srcExists) {
          return 'Source file does not exist';
        }

        if (!destExists) {
          return copyFile(args.src, args.dest)
            .then(() => `File synced from ${args.src} to ${args.dest}`)
            .catch((err) => `Error syncing file: ${err.message}`);
        } else {
          // 如果目标文件存在，则比较文件内容，只有当内容不同时才进行同步
          return Promise.all([readFile(args.src, 'utf8'), readFile(args.dest, 'utf8')])
            .then(([srcContent, destContent]) => {
              if (srcContent !== destContent) {
                return writeFile(args.dest, srcContent)
                  .then(() => `File synced from ${args.src} to ${args.dest}`)
                  .catch((err) => `Error syncing file: ${err.message}`);
              } else {
                return 'Files are already synchronized';
              }
            }).catch((err) => `Error checking file content: ${err.message}`);
        }
      },
    },
  },
});

// 创建GraphQL Schema
const schema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
});

// 启动GraphQL服务
const startServer = async () => {
  try {
    await graphql(schema, '{fileContent(filePath: "' + path.join(__dirname, 'example.txt') + '")}');
  } catch (error) {
    console.error('GraphQL server error:', error);
  }
};

startServer();
