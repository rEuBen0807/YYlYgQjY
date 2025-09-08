// 代码生成时间: 2025-09-08 17:13:52
 * It follows best practices for TypeScript coding and is designed to be easily understandable, maintainable, and extensible.
 */

import { GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql';
import { PubSub } from 'graphql-subscriptions';
import { gql } from 'apollo-server';
import { CronJob } from 'cron';
import { Observable } from 'rxjs';

// Define a GraphQL type for the timer event subscription
const TimerEventType = new GraphQLObjectType({
  name: 'TimerEvent',
  fields: {
    time: { type: GraphQLString },
  },
});

// Define the root schema with a query and a subscription
const rootSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      // Placeholder query field
      hello: { type: GraphQLString,
        resolve: () => 'world',
      },
    },
  }),
  subscription: new GraphQLObjectType({
    name: 'RootSubscriptionType',
    fields: {
      timerEvent: {
        type: TimerEventType,
        // Use PubSub to handle the subscription
        args: {
          cronPattern: { type: GraphQLString },
        },
        async subscribe(_, { cronPattern }, { pubsub }) {
          // Create a new CronJob based on the provided pattern
          const job = new CronJob({
            cronTime: cronPattern,
            onTick: () => {
              pubsub.publish('TIMER_EVENT', { timerEvent: { time: new Date().toISOString() } });
            },
            start: true,
          });

          // Return an observable that will complete when unsubscribed
          return new Observable((observer) => {
            // Handle the unsubscribe event
            return () => {
              job.stop();
              console.log('Timer job stopped.');
            };
          });
        },
      },
    },
  }),
});

// Define the GraphQL schema with the query and subscription
const typeDefs = gql`
  type TimerEvent {
    time: String
  }
  type Query {
    hello: String
  }
  type Subscription {
    timerEvent(cronPattern: String): TimerEvent
  }
`;

// Export the root schema and type definitions
export { rootSchema, typeDefs };
