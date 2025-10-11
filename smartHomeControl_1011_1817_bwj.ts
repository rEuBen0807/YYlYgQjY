// 代码生成时间: 2025-10-11 18:17:55
import { ApolloServer, gql } from 'apollo-server';
import { PubSub } from 'graphql-subscriptions';
import { withFilter } from 'graphql-subscriptions';

// Define the type of events that can be published
type EventType = 'DEVICE_ON' | 'DEVICE_OFF';

// Define the schema using the GraphQL schema language
const typeDefs = gql\`
  type Query {
    """
    Return the status of all devices.
    """
    getDevicesStatus: [Device]
  }

  type Mutation {
    """
    Toggle a device's power state.
    """
    toggleDevice(id: ID!, state: Boolean!): Device
  }

  type Subscription {
    """
    Subscribe to device status changes.
    """
    onDeviceStatusChange(deviceID: ID!): Device
  }

  type Device {
    id: ID!
    name: String!
    powerState: Boolean!
  }
\`;

// Instantiate a PubSub to handle real-time updates
const pubSub = new PubSub();

// In-memory store for device statuses
const devices = {
  1: { id: '1', name: 'Smart Light', powerState: false },
  2: { id: '2', name: 'Smart Thermostat', powerState: true },
  3: { id: '3', name: 'Smart Lock', powerState: false },
};

// Resolvers define the techniques for fetching the types in the schema
const resolvers = {
  Query: {
    getDevicesStatus: () => Object.values(devices),
  },

  Mutation: {
    toggleDevice: (_: any, { id, state }: { id: string, state: boolean }) => {
      const device = devices[id];
      if (!device) {
        throw new Error('Device not found');
      }
      device.powerState = state;
      // Publish the event to subscribers
      pubSub.publish('DEVICE_UPDATE', { onDeviceStatusChange: device });
      return device;
    },
  },

  Subscription: {
    onDeviceStatusChange: {
      subscribe: withFilter(
        () => pubSub.asyncIterator('DEVICE_UPDATE'),
        (payload, { deviceID }) => {
          return payload.onDeviceStatusChange.id === deviceID;
        },
      ),
    },
  },
};

// Create an instance of the ApolloServer with the type definitions and resolvers
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => ({ pubSub }),
  formatError: (err) => {
    // Log the error for debugging purposes
    console.error(err);
    // Return a simple error message to the client
    return err.message;
  },
});

// Start the server
server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
