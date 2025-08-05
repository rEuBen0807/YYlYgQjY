// 代码生成时间: 2025-08-05 13:45:59
import { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLNonNull, GraphQLList, GraphQLFieldResolver } from 'graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import sharp from 'sharp'; // Sharp is used for image processing
import fs from 'fs';
import path from 'path';

// Define the type for an image upload
const ImageUploadType = new GraphQLNonNull(GraphQLUpload);

// Define the input type for resizing images
const ImageResizeInputType = new GraphQLObjectType({
  name: 'ImageResizeInput',
  fields: {
    width: { type: GraphQLInt },
    height: { type: GraphQLInt },
  },
});

// Define the type for a resized image
const ResizedImageType = new GraphQLObjectType({
  name: 'ResizedImage',
  fields: {
    width: { type: GraphQLInt },
    height: { type: GraphQLInt },
    file: { type: GraphQLString },
  },
});

// Define the root query type
const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    // The resolver for resizing images
    resizeImages: {
      type: new GraphQLList(ResizedImageType),
      args: {
        images: { type: new GraphQLList(ImageUploadType) },
        resizeInput: { type: new GraphQLList(ImageResizeInputType) },
      },
      resolve: async (_, args) => {
        const images = args.images.map((file) => file);
        const resizeInputs = args.resizeInput.map((input) => input);

        // Validate input
        if (!images || !resizeInputs || images.length !== resizeInputs.length) {
          throw new Error('Invalid input for resizing images');
        }

        try {
          const resizedImages = [];
          for (let i = 0; i < images.length; i++) {
            const imageFile = images[i];
            const resizeInput = resizeInputs[i];

            // Create a unique file name for the resized image
            const uniqueFileName = path.join('resized-images', `${Date.now()}-${imageFile.filename}`);

            // Use Sharp to resize the image
            const resizedBuffer = await sharp(imageFile)
              .resize(resizeInput.width, resizeInput.height)
              .toBuffer();

            // Save the resized image to disk
            fs.writeFileSync(uniqueFileName, resizedBuffer);

            // Add the resized image to the result array
            resizedImages.push({
              width: resizeInput.width,
              height: resizeInput.height,
              file: uniqueFileName,
            });
          }
          return resizedImages;
        } catch (error) {
          throw new Error('Failed to resize images: ' + error.message);
        }
      },
    },
  },
});

// Create the GraphQL schema
const schema = new GraphQLSchema({
  query: RootQueryType,
  // Mutation and Subscription types can also be added here
});

// Export the schema for use in a GraphQL server
export { schema };