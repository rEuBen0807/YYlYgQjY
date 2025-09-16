// 代码生成时间: 2025-09-16 11:51:31
import { GraphQLSchema, GraphQLObjectType, GraphQLNonNull, GraphQLInt, GraphQLFieldConfig, GraphQLFieldConfigMap } from 'graphql';

// Define the type for the query result
const RandomNumberResultType = new GraphQLObjectType({
    name: 'RandomNumberResult',
    fields: {
        randomNumber: { type: new GraphQLNonNull(GraphQLInt) },
    },
});

// Define the root query
const RootQueryType = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: (): GraphQLFieldConfigMap<{}, any> => ({
        random: {
            type: RandomNumberResultType,
            resolve: (): { randomNumber: number } => {
                // Generate a random number between 1 and 100
                const randomNumber = Math.floor(Math.random() * 100) + 1;
                return { randomNumber };
            },
        },
    }),
});

// Construct a schema, using GraphQLSchema
const schema = new GraphQLSchema({
    query: RootQueryType,
});

// Export the schema for use in the GraphQL server
export default schema;