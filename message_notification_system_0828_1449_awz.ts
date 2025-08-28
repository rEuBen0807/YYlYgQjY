// 代码生成时间: 2025-08-28 14:49:15
 * adherence to TS best practices, and ensures maintainability and extensibility.
 */

import { ApolloServer, gql } from 'apollo-server';
import { DataSources } from 'apollo-server';
import { PubSub } from 'graphql-subscriptions';
import { Message } from './models/Message';
import { User } from './models/User';

// Define the GraphQL schema
const typeDefs = gql`
  type Query {
    messages: [Message]
  }

  type Mutation {
    sendMessage(content: String!, receiverId: ID!): Message
  }

  type Subscription {
    messageReceived: Message
  }

  type Message {
    id: ID!
    content: String!
    senderId: ID!
    receiverId: ID!
    timestamp: String!
  }

  type User {
    id: ID!
    name: String!
  }
`;

// Define the resolver map
const resolvers = {
  Query: {
    messages: async (_, __, { dataSources }) => {
      try {
        return await dataSources.messageAPI.getAllMessages();
      } catch (error) {
        console.error("Error fetching messages: ", error);
        throw new Error("Failed to fetch messages");
      }
    },
  },

  Mutation: {
    sendMessage: async (_, { content, receiverId }, { dataSources }) => {
      try {
        const message = await dataSources.messageAPI.createMessage({ content, receiverId });
        dataSources.pubsub.publish('NEW_MESSAGE', message);
        return message;
      } catch (error) {
        console.error("Error sending message: ", error);
        throw new Error("Failed to send message");
      }
    },
  },

  Subscription: {
    messageReceived: {
      subscribe: (_, __, { dataSources }) => {
        return dataSources.pubsub.asyncIterator('NEW_MESSAGE');
      },
    },
  },
};

// Define a custom dataSource for messages
interface MessageAPI {
  getAllMessages: () => Promise<Message[]>;
  createMessage: (options: { content: string; receiverId: string }) => Promise<Message>;
}

// Implement the MessageAPI with actual logic
class MessageDataSource implements MessageAPI {
  private messages: Message[] = [];

  getAllMessages(): Promise<Message[]> {
    return Promise.resolve(this.messages);
  }

  createMessage({ content, receiverId }: { content: string; receiverId: string }): Promise<Message> {
    const message: Message = {
      id: this.messages.length.toString(),
      content,
      senderId: 'sender-id', // Placeholder for sender ID
      receiverId,
      timestamp: new Date().toISOString(),
    };
    this.messages.push(message);
    return Promise.resolve(message);
  }
}

// Set up the Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    messageAPI: new MessageDataSource(),
    pubsub: new PubSub(),
  }),
});

// Start the server
server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});