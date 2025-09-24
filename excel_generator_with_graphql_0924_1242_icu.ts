// 代码生成时间: 2025-09-24 12:42:15
 * It provides a GraphQL endpoint to receive input data and generate an Excel file accordingly.
 *
 * @author Your Name
 * @version 1.0.0
 * @since 2023-04-01
 */

import { ApolloServer } from 'apollo-server';
import { buildSchema } from 'type-graphql';
import * as xlsx from 'node-xlsx';
import * as fs from 'fs';
import { GraphQLObjectType, Arg, Mutation, Resolver, Field } from 'type-graphql';

// Define the GraphQL schema for input data
@ObjectType()
class ExcelInput {
  @Field()
  @Field()
  headers: string[];

  @Field(() => [String])
  rows: string[][];
}

// Define the GraphQL schema for the response data
@ObjectType()
class ExcelResponse {
  @Field()
  success: boolean;

  @Field({ nullable: true })
  error?: string;
}

// Resolver for the Excel generation
@Resolver(ExcelInput)
class ExcelResolver {
  // Mutation to generate Excel file
  @Mutation(() => ExcelResponse)
  async generateExcel(@Arg('data') data: ExcelInput): Promise<ExcelResponse> {
    try {
      // Validate input data
      if (!data.headers || !data.rows) {
        throw new Error('Headers and rows are required for Excel generation.');
      }

      // Create buffer from input data
      const buffer = xlsx.build([{
        name: 'Sheet1',
        data: [data.headers].concat(data.rows),
      }]);

      // Write buffer to file
      fs.writeFileSync('output.xlsx', buffer, 'binary');

      // Return success response
      return { success: true };
    } catch (error) {
      // Handle error and return failure response
      console.error(error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}

// Build GraphQL schema and create Apollo server
async function startServer() {
  const schema = await buildSchema({
    resolvers: [ExcelResolver],
  });

  const server = new ApolloServer({
    schema,
    context: () => ({
      // Provide context if needed
    }),
  });

  server.listen().then(({ url }) => {
    console.log(`Excel Generator Server running at ${url}`);
  });
}

// Start the server
startServer().catch(console.error);