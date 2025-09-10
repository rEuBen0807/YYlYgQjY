// 代码生成时间: 2025-09-11 03:50:40
// backup_and_sync_tool.ts

// This tool provides functionality for backing up and syncing files.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { promisify } from 'util';

// Define the interfaces for better type checking and documentation
interface FileBackupOptions {
  sourcePath: string;
  backupPath: string;
}

interface SyncOptions extends FileBackupOptions {
  syncPath: string;
}

// Promisify the fs functions for better async handling
const fsReadFile = promisify(readFileSync);
const fsWriteFile = promisify(writeFileSync);
const fsExists = promisify(existsSync);
const fsMkdir = promisify(mkdirSync);

class BackupAndSyncTool {
  // Backups the file specified in the options to the backup path
  public static async backupFile(options: FileBackupOptions): Promise<void> {
    try {
      // Check if the source file exists
      if (!await fsExists(options.sourcePath)) {
        throw new Error('Source file does not exist.');
      }

      // Ensure the backup directory exists
      await fsMkdir(options.backupPath, { recursive: true });

      // Read the source file and write it to the backup location
      const fileContent = await fsReadFile(options.sourcePath);
      await fsWriteFile(join(options.backupPath, options.sourcePath.split('/').pop()!), fileContent);

      console.log('Backup completed successfully.');
    } catch (error) {
      console.error('Error during backup:', error.message);
    }
  }

  // Syncs the files between the source and target paths
  public static async syncFiles(options: SyncOptions): Promise<void> {
    try {
      // Check if both paths exist
      if (!await fsExists(options.sourcePath) || !await fsExists(options.syncPath)) {
        throw new Error('Source or target path does not exist.');
      }

      // Ensure the backup directory exists
      await fsMkdir(options.backupPath, { recursive: true });

      // Read all files from the source path and write them to the sync path
      const files = await this.readDirectory(options.sourcePath);
      for (const file of files) {
        const sourceFilePath = join(options.sourcePath, file);
        const targetFilePath = join(options.syncPath, file);
        const fileContent = await fsReadFile(sourceFilePath);
        await fsWriteFile(targetFilePath, fileContent);
      }

      console.log('Sync completed successfully.');
    } catch (error) {
      console.error('Error during sync:', error.message);
    }
  }

  // Helper function to read all files in a directory and return their names
  private static async readDirectory(directory: string): Promise<string[]> {
    const files = [];
    const directories = await promisify(fs.readdir)(directory);
    for (const directory of directories) {
      const path = join(directory, directory);
      if (await fsExists(path) && (await fsExists(path)).isFile()) {
        files.push(directory);
      }
    }
    return files;
  }
}

// Example usage:
// Backup a file
BackupAndSyncTool.backupFile({
  sourcePath: './path/to/source/file.txt',
  backupPath: './path/to/backup/directory'
}).then(() => console.log('Backup operation completed.'));

// Sync files between two directories
BackupAndSyncTool.syncFiles({
  sourcePath: './path/to/source/directory',
  syncPath: './path/to/target/directory',
  backupPath: './path/to/backup/directory'
}).then(() => console.log('Sync operation completed.'));
