// 代码生成时间: 2025-09-16 23:17:03
import { Pool, PoolConfig } from 'pg'; // Import PostgreSQL client
import { GraphQLError } from 'graphql'; // Import GraphQL error handling

// Database connection pool configuration
const poolConfig: PoolConfig = {
  user: 'your_username', // Replace with your database username
  host: 'localhost',
  database: 'your_database_name', // Replace with your database name
  password: 'your_password', // Replace with your database password
  port: 5432,
};

// Create a PostgreSQL connection pool
const pool = new Pool(poolConfig);

// Function to query the database using the pool
async function queryDb(query: string, params?: any[]) {
  try {
    // Connect to the database using the pool
    const client = await pool.connect();
    try {
      // Execute the query
      const result = await client.query(query, params);
      // Return the query result
      return result;
    } catch (error) {
      // Handle query error
      throw new GraphQLError('Database query failed', { extensions: { code: 'INTERNAL_SERVER_ERROR' }, originalError: error });
    } finally {
      // Release the client back to the pool
      client.release();
    }
  } catch (error) {
    // Handle connection error
    throw new GraphQLError('Database connection failed', { extensions: { code: 'INTERNAL_SERVER_ERROR' }, originalError: error });
  }
}

// Example usage of the queryDb function
async function exampleUsage() {
  try {
    const query = 'SELECT * FROM your_table_name'; // Replace with your actual table name
    const result = await queryDb(query);
    console.log(result.rows);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Export the queryDb function for use in other modules
export { queryDb };