// 代码生成时间: 2025-08-08 01:38:34
import { ApolloServer, gql } from 'apollo-server';
import { readFileSync, writeFileSync } from 'fs';
import XLSX from 'xlsx';
import path from 'path';

// Define the GraphQL schema
const typeDefs = gql`
  type File {
    name: String!
    content: String!
  }

type Query {
    generateExcel(data: [ExcelData]): File
  }

t type ExcelData {
    sheetName: String!
    headers: [String!]!
    rows: [[String!]!]!
  }
`;

// Define the resolvers
const resolvers = {
  Query: {
    generateExcel: async (_, { data }) => {
      // Create a new Excel workbook and add a new worksheet
      const workbook = XLSX.utils.book_new();

      try {
        // Iterate over the provided data to create sheets
        data.forEach((item) => {
          const { sheetName, headers, rows } = item;
          const worksheetData = [headers, ...rows];
          XLSX.utils.book_append_sheet(
            workbook,
            XLSX.utils.aoa_to_sheet(worksheetData),
            sheetName
          );
        });

        // Write the Excel file
        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
        const fileName = 'generated_excel_file.xlsx';
        writeFileSync(path.join(__dirname, fileName), buffer);

        return {
          name: fileName,
          content: buffer.toString('base64')
        };

      } catch (error) {
        console.error('An error occurred while generating the Excel file:', error);
        throw new Error('Failed to generate Excel file.');
      } finally {
        XLSX.utils.book_destroy(workbook);
      }
    }
  }
};

// Create the Apollo Server instance
const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (error) => {
    // Log and return a user-friendly error message
    console.error(error);
    return error.message;
  },
});

// Start the server
server.listen().then(({ url }) => {
  console.log(`Excel Generator GraphQL service ready at ${url}`);
});