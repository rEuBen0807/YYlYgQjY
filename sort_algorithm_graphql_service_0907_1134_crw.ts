// 代码生成时间: 2025-09-07 11:34:24
import { gql } from 'apollo-server';
import { Arg, Resolver, Query, Mutation } from 'type-graphql';

// Define a class to represent the sorting algorithm
class SortingAlgorithm {
  private numbers: number[];

  constructor(numbers: number[]) {
    this.numbers = numbers;
  }

  // A simple bubble sort algorithm
  bubbleSort(): number[] {
    let swapped;
    do {
      swapped = false;
      for (let i = 0; i < this.numbers.length - 1; i++) {
        if (this.numbers[i] > this.numbers[i + 1]) {
          // Swap the elements
          const temp = this.numbers[i];
          this.numbers[i] = this.numbers[i + 1];
          this.numbers[i + 1] = temp;
          swapped = true;
        }
      }
    } while (swapped);
    return this.numbers;
  }
}

// Define the GraphQL schema for the sorting algorithm
const typeDefs = gql`
  type Query {
    "Returns the sorted array"
    getSortedNumbers(input: [Int]!): [Int]!
  }
  type Mutation {
    "Sorts the array using the bubble sort algorithm"
    sortNumbers(input: [Int]!): [Int]!
  }
`;

// Define the resolvers for the GraphQL schema
@Resolver()
class SortingResolver {
  // Query to retrieve the sorted numbers
  @Query(() => [Int], { description: 'Returns the sorted array' })
  getSortedNumbers(@Arg('input') input: number[]): number[] {
    try {
      const sorter = new SortingAlgorithm(input);
      return sorter.bubbleSort();
    } catch (error) {
      throw new Error("Failed to sort numbers: " + error.message);
    }
  }

  // Mutation to sort numbers using bubble sort algorithm
  @Mutation(() => [Int], { description: 'Sorts the array using the bubble sort algorithm' })
  sortNumbers(@Arg('input') input: number[]): number[] {
    try {
      const sorter = new SortingAlgorithm(input);
      return sorter.bubbleSort();
    } catch (error) {
      throw new Error("Failed to sort numbers: " + error.message);
    }
  }
}

export { SortingResolver, typeDefs };
