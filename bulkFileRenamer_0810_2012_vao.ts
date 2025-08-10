// 代码生成时间: 2025-08-10 20:12:18
import * as fs from 'fs/promises';
import * as path from 'path';

interface RenameOptions {
  directory: string;
  renamePattern: (filename: string) => string;
}

class BulkFileRenamer {

  /**
   * Renames files in a specified directory according to a given pattern.
   * @param options An object containing the directory path and a rename pattern function.
   */
  public async renameFiles(options: RenameOptions): Promise<void> {
    try {
      const { directory, renamePattern } = options;
      const files = await fs.readdir(directory);
      
      for (const file of files) {
        const oldPath = path.join(directory, file);
        const stats = await fs.stat(oldPath);
        
        if (stats.isFile()) {
          const newName = renamePattern(file);
          const newPath = path.join(directory, newName);
          
          await fs.rename(oldPath, newPath);
          console.log(`Renamed ${oldPath} to ${newPath}`);
        }
      }
    } catch (error) {
      console.error('Error renaming files:', error);
      throw error;
    }
  }
}

// Example usage:
// const renamer = new BulkFileRenamer();
// renamer.renameFiles({
//   directory: './path/to/files',
//   renamePattern: filename => `new-${filename}`,
// }).then(() => console.log('All files renamed successfully')).catch(error => console.error('Failed to rename files:', error));
