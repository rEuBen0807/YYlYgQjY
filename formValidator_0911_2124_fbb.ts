// 代码生成时间: 2025-09-11 21:24:18
import { ApolloError, UserInputError } from 'apollo-server';
import { validate as validateUuid } from 'uuid';
import validator from 'validator';

// FormValidationError is a custom error class for form validation errors.
class FormValidationError extends ApolloError {
  constructor(message: string) {
    super(message, 'FORM_VALIDATION_ERROR');
  }
}

// FormValidator is a class that provides methods for validating form data.
class FormValidator {
  private static instance: FormValidator;

  // Private constructor to prevent direct instantiation.
  private constructor() {}

  // getInstance method to provide a singleton instance.
  public static getInstance(): FormValidator {
    if (!FormValidator.instance) {
      FormValidator.instance = new FormValidator();
    }
    return FormValidator.instance;
  }

  // validateString checks if the input string meets the required criteria.
  public validateString(input: any, minLength: number, maxLength: number, name: string): void {
    if (typeof input !== 'string') {
      throw new FormValidationError(`${name} must be a string.`);
    }
    if (!validator.isLength(input, { min: minLength, max: maxLength })) {
      throw new FormValidationError(`${name} must be between ${minLength} and ${maxLength} characters long.`);
    }
  }

  // validateEmail checks if the input string is a valid email.
  public validateEmail(input: any): void {
    if (!validator.isEmail(input)) {
      throw new FormValidationError('Email is invalid.');
    }
  }

  // validateUuid checks if the input string is a valid UUID.
  public validateUuid(input: any): void {
    if (!validateUuid(input)) {
      throw new FormValidationError('Invalid UUID.');
    }
  }

  // validateNumber checks if the input number meets the required criteria.
  public validateNumber(input: any, min: number, max: number, name: string): void {
    if (typeof input !== 'number') {
      throw new FormValidationError(`${name} must be a number.`);
    }
    if (input < min || input > max) {
      throw new FormValidationError(`${name} must be between ${min} and ${max}.`);
    }
  }

  // validateBoolean checks if the input is a boolean.
  public validateBoolean(input: any): void {
    if (typeof input !== 'boolean') {
      throw new FormValidationError('Must be a boolean value.');
    }
  }
}

// Example of how to use FormValidator
export function validateFormData(data: { [key: string]: any }) {
  const validator = FormValidator.getInstance();
  try {
    validator.validateString(data.name, 1, 100, 'Name');
    validator.validateEmail(data.email);
    validator.validateUuid(data.id);
    validator.validateNumber(data.age, 18, 100, 'Age');
    validator.validateBoolean(data.agreedToTerms);
  } catch (error) {
    if (error instanceof FormValidationError) {
      throw new UserInputError(error.message);
    } else {
      throw new Error('An unexpected error occurred.');
    }
  }
}
