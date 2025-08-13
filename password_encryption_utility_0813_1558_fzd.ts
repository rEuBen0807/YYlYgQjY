// 代码生成时间: 2025-08-13 15:58:56
 * It follows TypeScript best practices and is designed to be easily maintainable and extendable.
 */

import * as bcrypt from 'bcrypt';

interface PasswordEncryptionUtility {
  encrypt: (password: string) => Promise<string>;
  decrypt: (hashedPassword: string, password: string) => Promise<boolean>;
}

class PasswordEncryptionUtility implements PasswordEncryptionUtility {

  private saltRounds: number = 10; // Define the number of salt rounds for bcrypt

  /**
   * Encrypts a plain text password using bcrypt.
   * @param {string} password - The plain text password to encrypt.
   * @returns {Promise<string>} - The hashed password.
   */
  public async encrypt(password: string): Promise<string> {
    try {
      // Generate a salt and hash the password
      const hashedPassword: string = await bcrypt.hash(password, this.saltRounds);
      return hashedPassword;
    } catch (error) {
      // Handle any errors that occur during encryption
      console.error('Encryption error:', error);
      throw error;
    }
  }

  /**
   * Decrypts a password by comparing it with a hashed password.
   * @param {string} hashedPassword - The hashed password to compare against.
   * @param {string} password - The plain text password to compare.
   * @returns {Promise<boolean>} - Whether the password matches the hashed password.
   */
  public async decrypt(hashedPassword: string, password: string): Promise<boolean> {
    try {
      // Compare the plain text password with the hashed password
      const isMatch: boolean = await bcrypt.compare(password, hashedPassword);
      return isMatch;
    } catch (error) {
      // Handle any errors that occur during decryption
      console.error('Decryption error:', error);
      throw error;
    }
  }
}

// Example usage
const utility = new PasswordEncryptionUtility();

(async () => {
  try {
    const password = 'examplePassword';
    const encryptedPassword = await utility.encrypt(password);
    console.log('Encrypted Password:', encryptedPassword);

    const isPasswordCorrect = await utility.decrypt(encryptedPassword, password);
    console.log('Is password correct:', isPasswordCorrect);
  } catch (error) {
    console.error('An error occurred:', error);
  }
})();