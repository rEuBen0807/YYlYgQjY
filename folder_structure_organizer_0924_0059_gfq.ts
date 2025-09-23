// 代码生成时间: 2025-09-24 00:59:45
import { GraphQLSchema, printSchema, buildSchema } from 'graphql';
import * as fs from 'fs';
import * as path from 'path';
import { readFileSync } from 'fs';

// 定义GraphQL类型
const typeDefs = `
  type Folder {
    id: ID!
    name: String!
    parent: Folder
    children: [Folder]
  }

  type Query {
    getFolder(id: ID!): Folder
    getFolders: [Folder]
  }
`;

// 定义文件夹查询解析器
const resolvers = {
  Folder: {
    // 递归获取文件夹的子文件夹
    children: (folder) => {
      try {
        const children = fs.readdirSync(folder.path)
          .filter((file) => fs.statSync(path.join(folder.path, file)).isDirectory())
          .map((file) => ({
            id: file,
            name: file,
            path: path.join(folder.path, file),
            parent: folder,
          }))
          .map((child) => resolvers.Folder.resolve(child));
        return children;
      } catch (error) {
        throw new Error('Failed to read folder children: ' + error.message);
      }
    },
  },
  Query: {
    getFolder: (_source, { id }) => {
      try {
        const folder = fs.statSync(id).isDirectory() && { id, name: path.basename(id), path: id };
        if (folder) return resolvers.Folder.resolve(folder);
        throw new Error('Folder not found');
      } catch (error) {
        throw new Error('Failed to get folder: ' + error.message);
      }
    },
    getFolders: () => {
      try {
        const folders = fs.readdirSync('/')
          .filter((file) => fs.statSync(path.join('/', file)).isDirectory())
          .map((file) => ({
            id: file,
            name: file,
            path: path.join('/', file),
          }))
          .map((folder) => resolvers.Folder.resolve(folder));
        return folders;
      } catch (error) {
        throw new Error('Failed to read root folders: ' + error.message);
      }
    },
  },
};

// 构建GraphQL Schema
const schema: GraphQLSchema = buildSchema(typeDefs);

// 导出GraphQL Schema
export const schemaString = printSchema(schema);

// 导出解析器
export const resolversObject = resolvers;

// 测试代码
if (require.main === module) {
  console.log('Folder Structure Organizer Test');
  console.log('GraphQL Schema:
' + schemaString);
  console.log('GraphQL Resolvers:
' + JSON.stringify(resolversObject, null, 2));
}
