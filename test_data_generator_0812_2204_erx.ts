// 代码生成时间: 2025-08-12 22:04:44
import { faker } from '@faker-js/faker';
import { GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql';
import { graphqlSync } from 'graphql-sync';

// 定义一个类型，用于生成测试数据
interface TestData {
  id: string;
  name: string;
  email: string;
}

// 创建一个测试数据生成器类
class TestDataGenerator {
  // 生成单个测试数据
  public generateTestData(): TestData {
    return {
      id: faker.datatype.uuid(),
      name: faker.person.firstName() + ' ' + faker.person.lastName(),
      email: faker.internet.email(),
    };
  }

  // 生成多个测试数据
  public generateTestDataList(num: number): TestData[] {
    const testDataList: TestData[] = [];
    for (let i = 0; i < num; i++) {
      testDataList.push(this.generateTestData());
    }
    return testDataList;
  }
}

// 定义GraphQL查询类型
const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    test: {
      type: GraphQLString,
      resolve: () => {
        const testDataGenerator = new TestDataGenerator();
        return JSON.stringify(testDataGenerator.generateTestDataList(10));
      },
    },
  },
});

// 创建GraphQL Schema
const schema = new GraphQLSchema({
  query: queryType,
});

// GraphQL查询示例
const query = '{ test }';

// 执行GraphQL查询
const result = graphqlSync({
  schema: schema,
  source: query,
  contextValue: null,
  variableValues: {},
  rootValue: null,
  // 错误处理
  customParseOptions: {
    allowLegacySDLEmptyFields: true,
  },
  // 错误处理
  customExecuteFn: (args) => {
    try {
      return args.next();
    } catch (error) {
      throw new Error('GraphQL execution error: ' + error.message);
    }
  },
  // 错误处理
  customFormatErrorFn: (error) => {
    return { message: error.message, locations: error.locations, path: error.path };
  },
});

// 输出结果
console.log(result);
