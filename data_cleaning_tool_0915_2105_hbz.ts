// 代码生成时间: 2025-09-15 21:05:45
import { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLNonNull } from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';

// 定义数据清洗工具类
class DataCleaningTool {
    /**
     * 清洗字符串数据，移除前后空白字符
     * @param input 待清洗的字符串
     */
    static cleanString(input: string): string {
        return input.trim();
    }

    /**
     * 清洗日期数据，确保日期格式正确
     * @param input 待清洗的日期字符串
     */
    static cleanDate(input: string): string | null {
        const date = new Date(input);
        if (isNaN(date.getTime())) {
            throw new Error('Invalid date format');
        }
        return date.toISOString();
    }
}

// 定义 GraphQL 类型和查询
const queryType = new GraphQLObjectType({
    name: 'Query',
    fields: {
        cleanString: {
            type: GraphQLString,
            args: {
                input: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve(parent, args) {
                try {
                    return DataCleaningTool.cleanString(args.input);
                } catch (error) {
                    throw new Error('Error cleaning string: ' + error.message);
                }
            },
        },
        cleanDate: {
            type: GraphQLDateTime,
            args: {
                input: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve(parent, args) {
                try {
                    return DataCleaningTool.cleanDate(args.input);
                } catch (error) {
                    throw new Error('Error cleaning date: ' + error.message);
                }
            },
        },
    },
});

// 定义 GraphQL Schema
const schema = new GraphQLSchema({ query: queryType });

export default schema;