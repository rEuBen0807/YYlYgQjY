// 代码生成时间: 2025-08-18 19:59:41
import fs from 'fs';
import path from 'path';
import { GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql';
import { fileLoader, mergeTypes } from '@graphql-tools/load';
import { mergeResolvers } from '@graphql-tools/merge';

// Define a type for the configuration interface
interface ConfigType {
  [key: string]: any;
}

// Define the configuration manager class
class ConfigManager {
  private config: ConfigType;

  constructor(private configPath: string) {
    this.config = {};
  }

  // Load and parse the configuration file
  public async loadConfig(): Promise<ConfigType> {
    try {
      // Check if the configuration file exists
      if (!fs.existsSync(this.configPath)) {
        throw new Error('Configuration file does not exist.');
      }
      
      // Read the configuration file
      const configData = await fs.promises.readFile(this.configPath, 'utf8');
      
      // Parse the JSON configuration file
      this.config = JSON.parse(configData);
      return this.config;
    } catch (error) {
      // Handle any errors that occur during the loading process
      console.error('Error loading configuration:', error);
      throw error;
    }
  }

  // Get a specific configuration value by key
  public getConfigValue(key: string): any {
    if (key in this.config) {
      return this.config[key];
    }
    throw new Error(`Configuration value for key '${key}' not found.`);
  }
}

// Define a GraphQL schema based on the configuration
const defineGraphQLSchema = (config: ConfigType): GraphQLSchema => {
  const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './schema/*.graphql')));
  const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers/*.resolvers.ts')));

  return new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'Query',
      fields: {
        getConfig: {
          type: GraphQLString,
          resolve: (_parent, _args, _context, _info) => config,
        },
      },
    }),
  });
};

// Export the ConfigManager class and the schema definition function
export { ConfigManager, defineGraphQLSchema };