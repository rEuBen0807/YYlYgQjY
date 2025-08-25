// 代码生成时间: 2025-08-26 06:11:09
import { GraphQLSchema, validate } from 'graphql';
import { buildSchema } from 'graphql/utilities/buildSchema';
import { printSchema } from 'graphql/utilities/printSchema';

// Define the GraphQL schema for the form data
const formSchema = buildSchema(`
  enum ValidationError {
    REQUIRED,
    INVALID_EMAIL,
    INVALID_PASSWORD
  }

  type Mutation {
    submitForm: String
  }

  input FormData {
    username: String!
    email: String
    password: String
  }
`);

// Define the validation rules
const validationRules = {
  username: value => value.trim().length > 0 || 'REQUIRED',
  email: value => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value) || 'INVALID_EMAIL',
  password: value => value.length >= 8 || 'INVALID_PASSWORD',
};

// Function to validate form data
function validateFormData(formData: { [key: string]: any }) {
  // Check for required fields
  if (!formData.username) {
    throw new Error('Username is required');
  }

  const errors: { field: string; message: string }[] = [];

  // Validate each field according to the rules
  for (const [field, value] of Object.entries(formData)) {
    const rule = validationRules[field];
    if (rule && typeof rule === 'function') {
      const error = rule(value);
      if (error) {
        errors.push({ field, message: error });
      }
    }
  }

  if (errors.length > 0) {
    throw new Error('Validation errors: ' + JSON.stringify(errors));
  }

  return 'Form data is valid';
}

// Example usage of the validator
try {
  const formData = {
    username: 'johndoe',
    email: 'johndoe@example.com',
    password: 'password123',
  };

  const validationResult = validateFormData(formData);
  console.log(validationResult);
} catch (error) {
  console.error(error);
}
