// 代码生成时间: 2025-09-22 13:42:53
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Helper function to read directory contents
function readDirectoryContents(dirPath: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
        fs.readdir(dirPath, (err, files) => {
            if (err) {
                reject(err);
            } else {
                resolve(files);
            }
        });
    });
}

// Helper function to copy file
async function copyFile(src: string, dest: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const readStream = fs.createReadStream(src);
        const writeStream = fs.createWriteStream(dest);
        readStream.on('error', (error) => reject(error));
        writeStream.on('error', (error) => reject(error));
        readStream.on('close', () => resolve());
        readStream.pipe(writeStream);
    });
}

// Function to backup and sync files
async function backupAndSync(sourceDir: string, backupDir: string): Promise<void> {
    try {
        // Check if source directory exists
        if (!fs.existsSync(sourceDir)) {
            throw new Error(`Source directory ${sourceDir} does not exist.`);
        }

        // Check if backup directory exists, if not create it
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true });
        }

        // Read source directory contents
        const files = await readDirectoryContents(sourceDir);

        // Loop through files and copy them to backup directory
        for (const file of files) {
            const sourceFilePath = path.join(sourceDir, file);
            const backupFilePath = path.join(backupDir, file);
            await copyFile(sourceFilePath, backupFilePath);
        }

        console.log('Backup and sync completed successfully.');
    } catch (error) {
        console.error('Error during backup and sync:', error);
    }
}

// Main function to run the backup and sync tool
async function main() {
    const sourceDir = './source';
    const backupDir = './backup';

    await backupAndSync(sourceDir, backupDir);
}

// Run the main function
main();