// 代码生成时间: 2025-09-18 10:13:52
import { GraphQLSchema, printSchema, buildSchema } from 'graphql';
import fs from 'fs';
import path from 'path';
import { GraphQLObjectType, GraphQLString, GraphQLInt } from 'graphql';

// 定义 GraphQL 查询类型
const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    getFolderStructure: {
      type: GraphQLString,
      resolve: () => {
        return listDirectoryContents('./'); // 假设当前目录为根目录
      },
    },
  },
});

// 构建 GraphQL 模式
const Schema = new GraphQLSchema({
  query: QueryType,
});

// 导出 GraphQL 模式字符串，用于调试或存储
export const schemaString = printSchema(Schema);

// 函数：列出目录内容
function listDirectoryContents(directoryPath: string): string {
  try {
    const files = fs.readdirSync(directoryPath);
    return files.join('
');
  } catch (error) {
    // 错误处理：目录不存在或读取错误
    console.error('Error reading directory:', error);
    throw new Error('Failed to read directory contents.');
  }
}

// 函数：递归创建目录结构
function createDirectoryStructure(directoryPath: string): void {
  try {
    fs.readdir(directoryPath, { withFileTypes: true }, (err, files) => {
      if (err) {
        throw err;
      }
      files.forEach(file => {
        if (file.isDirectory()) {
          const newDirectoryPath = path.join(directoryPath, file.name);
          console.log(`Directory: ${file.name}`);
          createDirectoryStructure(newDirectoryPath); // 递归调用
        } else {
          console.log(`File: ${file.name}`);
        }
      });
    });
  } catch (error) {
    // 错误处理：目录不存在或读取错误
    console.error('Error creating directory structure:', error);
    throw new Error('Failed to create directory structure.');
  }
}

// 主函数，执行程序
function main() {
  const rootDirectory = './';
  console.log('Starting folder structure organizer...');
  createDirectoryStructure(rootDirectory);
  console.log('Folder structure organized.');}

// 运行主函数
main();
