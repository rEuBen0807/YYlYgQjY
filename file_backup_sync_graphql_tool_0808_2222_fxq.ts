// 代码生成时间: 2025-08-08 22:22:38
import { GraphQLServer } from 'graphql-yoga';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

// 定义类型和接口
interface FileBackupSyncOptions {
  srcPath: string;
  destPath: string;
  overwrite: boolean;
}

// 文件备份和同步工具类
class FileBackupSyncTool {
  private srcPath: string;
  private destPath: string;
  private overwrite: boolean;

  constructor(options: FileBackupSyncOptions) {
    this.srcPath = options.srcPath;
    this.destPath = options.destPath;
    this.overwrite = options.overwrite;
  }

  // 备份和同步文件
  public async backupAndSync(): Promise<void> {
    try {
      // 检查源文件是否存在
      if (!existsSync(this.srcPath)) {
        throw new Error("Source file does not exist.");
      }

      // 读取源文件内容
      const fileContent = readFileSync(this.srcPath, 'utf-8');

      // 检查目标文件是否存在
      if (existsSync(this.destPath) && !this.overwrite) {
        throw new Error("Destination file already exists and overwrite is false.");
      }

      // 写入目标文件
      await writeFileSync(this.destPath, fileContent, 'utf-8');

      console.log(`File backup and sync completed from ${this.srcPath} to ${this.destPath}`);
    } catch (error) {
      console.error("Error during file backup and sync: ", error);
      throw error;
    }
  }
}

// 定义GraphQL Schema
const typeDefs = `
  type Query {
    backupAndSync(srcPath: String!, destPath: String!, overwrite: Boolean!): String
  }
`;

// 定义Resolvers
const resolvers = {
  Query: {
    backupAndSync: async (_, args) => {
      try {
        const { srcPath, destPath, overwrite } = args;
        const tool = new FileBackupSyncTool({ srcPath, destPath, overwrite });
        await tool.backupAndSync();
        return 'Backup and sync succeeded';
      } catch (error) {
        return `Error: ${error.message}`;
      }
    },
  },
};

// 创建和启动GraphQL服务器
const server = new GraphQLServer({
  typeDefs,
  resolvers,
  context: req => ({ ...req, dataSources: {} }),
  playground: true,
  introspection: true,
});

server.start(() => console.log(`Server is running on http://localhost:4000`));
