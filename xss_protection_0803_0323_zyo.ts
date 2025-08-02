// 代码生成时间: 2025-08-03 03:23:04
// XSS Protection
// This module provides utility functions to help prevent XSS attacks.
// It uses the DOMPurify library to sanitize inputs.

import DOMPurify from 'dompurify';
import { Request, Response } from 'express';

// Sanitizes input to prevent XSS attacks.
// @param input - the input string to sanitize.
// @returns sanitized input.
function sanitizeInput(input: string): string {
  try {
    // Use DOMPurify to sanitize the input.
    return DOMPurify.sanitize(input);
  } catch (error) {
    // If an error occurs during sanitization, log it and return an empty string.
    console.error('Error sanitizing input:', error);
    return '';
  }
}

// Middleware to sanitize all request bodies and query parameters to prevent XSS attacks.
// @param req - the Express request object.
// @param res - the Express response object.
// @param next - the Express next function.
function xssProtectionMiddleware(req: Request, res: Response, next: Function): void {
  // Sanitize all properties of the request body.
  Object.keys(req.body).forEach(key => {
    req.body[key] = sanitizeInput(req.body[key]);
  });
  
  // Sanitize all properties of the query parameters.
  Object.keys(req.query).forEach(key => {
    req.query[key] = sanitizeInput(req.query[key]);
  });
  
  // Continue to the next middleware.
  next();
}

// Export the middleware for use in Express applications.
export { xssProtectionMiddleware };
