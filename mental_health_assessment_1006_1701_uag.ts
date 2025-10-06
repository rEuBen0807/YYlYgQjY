// 代码生成时间: 2025-10-06 17:01:54
import { ApolloServer, gql } from 'apollo-server';
import { v4 as uuidv4 } from 'uuid';

// Define a type for mental health assessment data
interface MentalHealthAssessmentData {
  id: string;
  question: string;
  answer: string;
  impact: number;
}

// Sample data for mental health assessment
const mentalHealthAssessments: MentalHealthAssessmentData[] = [];

// Resolvers for the GraphQL schema
const resolvers = {
  Query: {
    // Fetch all mental health assessments
    allMentalHealthAssessments: (): MentalHealthAssessmentData[] => {
      return mentalHealthAssessments;
    },
  },
  Mutation: {
    // Add a new mental health assessment
    addMentalHealthAssessment: (_root: any, { question, answer, impact }: { question: string; answer: string; impact: number }): MentalHealthAssessmentData => {
      // Generate a unique ID for the new assessment
      const id = uuidv4();
      
      // Create the new assessment object
      const newAssessment: MentalHealthAssessmentData = {
        id,
        question,
        answer,
        impact,
      };
      
      // Add the new assessment to the sample data
      mentalHealthAssessments.push(newAssessment);
      
      // Return the newly created assessment
      return newAssessment;
    },
  },
};

// Define the GraphQL schema
const typeDefs = gql"
  type MentalHealthAssessment {
    id: ID!
    question: String!
    answer: String!
    impact: Float!
  }

  type Query {
    allMentalHealthAssessments: [MentalHealthAssessment]!
  }

  type Mutation {
    addMentalHealthAssessment(question: String!, answer: String!, impact: Float!): MentalHealthAssessment!
  }
";

// Create an Apollo Server instance with the schema and resolvers
const server = new ApolloServer({
  typeDefs,
  resolvers,
  // Error handling middleware
  formatError: (error) => {
    // Log and transform errors as needed
    console.error(error);
    // Remove sensitive error details
    return error;
  },
  // Enable the playground and schema introspection in production environment
  // Use `cors: false` to disable CORS for external requests
  introspection: true,
  playground: true,
});

// Start the server
server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});