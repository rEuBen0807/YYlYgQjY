// 代码生成时间: 2025-08-29 23:23:10
import { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLInt, GraphQLNonNull } from 'graphql';
import { graphql, GraphQLError } from 'graphql/subscription/subscription';
import { PubSub } from 'graphql-subscriptions';

// Define the structure of our data
interface IData {
    id: number;
    name: string;
    age: number;
}

// Create a PubSub instance
const pubSub = new PubSub();

// Define a data array for demonstration purposes
const data: IData[] = [
    { id: 1, name: "John Doe", age: 30 },
    { id: 2, name: "Jane Smith", age: 25 },
    { id: 3, name: "Bob Johnson", age: 40 }
];

// Function to clean and preprocess data
function cleanAndPreprocessData(data: IData[]): IData[] {
    return data.map(item => {
        // Trim and capitalize name for cleanliness
        item.name = item.name.trim().toLowerCase().charAt(0).toUpperCase() + item.name.slice(1).toLowerCase();

        // Ensure age is a positive integer
        if (item.age < 0 || !Number.isInteger(item.age)) {
            throw new Error(`Invalid age for ${item.name}: ${item.age}`);
        }

        return item;
    });
}

// Define the type of our data
const DataType = new GraphQLObjectType({
    name: 'Data',
    fields: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLString },
        age: { type: new GraphQLNonNull(GraphQLInt) }
    }
});

// Define the root mutation type
const MutationType = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        cleanAndPreprocess: {
            type: DataType,
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (_, args) => {
                const item = data.find(item => item.id === args.id);
                if (!item) {
                    throw new GraphQLError(`Data item with id ${args.id} not found.`);
                }

                try {
                    const cleanedData = cleanAndPreprocessData([item]);
                    return cleanedData[0];
                } catch (error) {
                    throw new GraphQLError(error.message);
                }
            }
        }
    }
});

// Define the schema
const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        fields: {
            data: {
                type: new GraphQLList(DataType),
                resolve: () => data
            }
        }
    }),
    mutation: MutationType
});

// Export the schema for use
export { schema };