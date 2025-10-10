// 代码生成时间: 2025-10-10 22:43:49
// rpc_service.ts

import { gql, ApolloClient, InMemoryCache, ApolloLink, HttpLink } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { makeVar, useReactiveVar } from '@apollo/client/react';

// RpcService 提供RPC远程调用功能
class RpcService {

    // 定义GraphQL客户端实例
    private client: ApolloClient<any>;

    // 构造函数，初始化ApolloClient
    constructor() {
        const httpLink = new HttpLink({
            uri: 'YOUR_GRAPHQL_API_ENDPOINT', // 替换为你的GraphQL服务端点
        });

        const errorLink = onError(({ graphQLErrors, networkError }) => {
            if (graphQLErrors) {
                graphQLErrors.forEach((error) => {
                    console.error('GraphQL Error:', error);
                });
            }

            if (networkError) {
                console.error('Network Error:', networkError);
            }
        });

        this.client = new ApolloClient({
            link: ApolloLink.from([errorLink, httpLink]),
            cache: new InMemoryCache(),
        });
    }

    // 调用远程方法
    async callRemoteProcedure(procedureName: string, variables: any): Promise<any> {
        try {
            const query = gql`
                mutation CallRemoteProcedure($procedureName: String!, $variables: JSON) {
                    callRemoteProcedure(procedureName: $procedureName, variables: $variables)
                }
            `;

            const response = await this.client.mutate({
                mutation: query,
                variables: { procedureName, variables },
            });

            return response.data?.callRemoteProcedure;
        } catch (error) {
            console.error('Error calling remote procedure:', error);
            throw error;
        }
    }
}

// 使用示例
const rpcService = new RpcService();

rpcService.callRemoteProcedure('myProcedure', { arg1: 'value1', arg2: 'value2' })
    .then(result => console.log('Remote procedure result:', result))
    .catch(error => console.error('Error:', error));
