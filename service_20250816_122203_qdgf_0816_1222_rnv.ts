// 代码生成时间: 2025-08-16 12:22:03
import fs from 'node:fs';
import path from 'node:path';

// Define a type for the folder structure
interface FolderStructure {
    name: string;
    type: 'folder' | 'file';
    children?: FolderStructure[];
}

// Function to recursively build the folder structure
function buildFolderStructure(directory: string): FolderStructure {
    const structure: FolderStructure = {
        name: path.basename(directory),
        type: 'folder',
        children: []
    };

    try {
        const items = fs.readdirSync(directory, { withFileTypes: true });

        for (const item of items) {
            const itemPath = path.join(directory, item.name);

            if (item.isDirectory()) {
                structure.children?.push(buildFolderStructure(itemPath));
            } else {
                structure.children?.push({
                    name: item.name,
                    type: 'file'
                });
            }
        }
    } catch (error) {
        console.error(`Error reading directory: ${error}`);
        throw error; // Rethrow the error after logging it
    }

    return structure;
}

// Function to print the folder structure in a readable format
function printFolderStructure(folder: FolderStructure, level: number = 0): void {
    console.log(' '.repeat(level * 2) + folder.name + (folder.type === 'folder' ? '/' : ''));

    if (folder.children) {
        folder.children.forEach((child) => printFolderStructure(child, level + 1));
    }
}

// Main function to organize the folder structure
function organizeFolderStructure(sourceDirectory: string): void {
    if (!fs.existsSync(sourceDirectory)) {
        console.error(`The directory ${sourceDirectory} does not exist.`);
        return;
    }

    try {
        const folderStructure = buildFolderStructure(sourceDirectory);
        printFolderStructure(folderStructure);
    } catch (error) {
        console.error(`Failed to organize folder structure: ${error}`);
    }
}

// Example usage
const sourceDirectory = './'; // Set the directory you want to organize
organizeFolderStructure(sourceDirectory);
