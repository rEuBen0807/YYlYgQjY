// 代码生成时间: 2025-09-13 10:54:17
import unzipper from 'unzipper';
import fs from 'fs/promises';
import path from 'path';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream';

/**
 * Extracts a ZIP file to a specified destination directory.
 *
 * @param zipFilePath - The path to the ZIP file to extract.
 * @param destinationDirectory - The directory where files will be extracted.
 * @returns A promise that resolves when extraction is complete.
 */
export async function extractZipFile(zipFilePath: string, destinationDirectory: string): Promise<void> {
    // Ensure the destination directory exists.
    try {
        await fs.mkdir(destinationDirectory, { recursive: true });
    } catch (error) {
        // If the directory already exists, continue; otherwise, throw an error.
        if (error.code !== 'EEXIST') {
            throw error;
        }
    }

    try {
        // Read the ZIP file and extract its contents to the destination directory.
        const readStream = await fs.createReadStream(zipFilePath);
        const extract = unzipper.Extract({ path: destinationDirectory });
        await pipeline(readStream, extract);
    } catch (error) {
        // Handle any errors that occur during the extraction process.
        console.error('Error extracting ZIP file:', error);
        throw error;
    }
}

/**
 * Example usage of the extractZipFile function.
 * This should be run in an environment where the module can be imported and executed.
 */
//(async () => {
//    try {
//        await extractZipFile('path/to/your/archive.zip', 'path/to/destination');
//        console.log('Extraction complete.');
//    } catch (error) {
//        console.error('Extraction failed:', error);
//    }
//})();