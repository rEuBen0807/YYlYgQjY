// 代码生成时间: 2025-09-12 23:30:44
 * It demonstrates the use of TypeScript classes, interfaces, and error handling.
 * It also follows best practices for maintainability and extensibility.
 */

import { validate as validateYup, ValidationError } from 'yup';

// Define the type for the form data
interface IFormData {
  username: string;
  email: string;
  password: string;
}

// Define the schema for Yup to validate against
const formSchema = {
  username: yup
    .string()
    .min(3, 'Username must be at least 3 characters long')
    .required('Username is required'),
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .required('Password is required'),
};

// Define an interface for the validator
interface IValidator {
  validate: (formData: IFormData) => Promise<void>;
}

// Implement the validator class
class FormValidator implements IValidator {
  // Validate form data against the schema
  public async validate(formData: IFormData): Promise<void> {
    try {
      // Validate the form data using Yup's validate function
      await validateYup(formData, formSchema);
    } catch (error) {
      // Handle validation errors
      if (error instanceof ValidationError) {
        throw new Error(error.message);
      } else {
        throw new Error('An unexpected error occurred during validation');
      }
    }
  }
}

// Example usage of the form validator
async function main(): Promise<void> {
  const formData: IFormData = {
    username: 'johndoe',
    email: 'john@example.com',
    password: 'password123',
  };

  const validator = new FormValidator();
  try {
    await validator.validate(formData);
    console.log('Form data is valid');
  } catch (error) {
    console.error('Form validation error:', error.message);
  }
}

main();
