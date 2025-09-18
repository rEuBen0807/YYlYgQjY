// 代码生成时间: 2025-09-18 17:04:18
import { GraphQLClient } from 'graphql-request';

// Define the GraphQL endpoint
const GRAPHQL_ENDPOINT = 'https://your-graphql-endpoint.com';

// Define the theme types
enum Theme {
  LIGHT = 'light',
  DARK = 'dark'
}

// GraphQL client configuration
const graphQLClient = new GraphQLClient(GRAPHQL_ENDPOINT, {
  headers: {
    // Add your authentication token if needed
    // 'Authorization': 'Bearer your_token_here'
  }
});

// GraphQL query for switching theme
const SWITCH_THEME_QUERY = `
  mutation SwitchTheme($theme: String!) {
    switchTheme(theme: $theme) {
      __typename
      theme
    }
  }
`;

/**
 * Switches the theme using a GraphQL mutation.
 * @param {Theme} theme The theme to switch to.
 * @returns {Promise<{ __typename: string; theme: Theme }>} The updated theme.
 */
export async function switchTheme(theme: Theme): Promise<{ __typename: string; theme: Theme }> {
  // Validate the theme
  if (!Object.values(Theme).includes(theme)) {
    throw new Error('Invalid theme provided');
  }

  try {
    // Execute the GraphQL mutation
    const response = await graphQLClient.request(SWITCH_THEME_QUERY, { theme });
    return response;
  } catch (error) {
    // Handle any errors that occur during the GraphQL request
    console.error('Error switching theme:', error);
    throw error;
  }
}
