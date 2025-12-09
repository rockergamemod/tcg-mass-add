# TODO: Add a build stage to build the NestJS application and then copy the built files into the production stage.
# TODO: Add proper production environment variable declarations and defaults
# TODO: Add proper labels, annotations, maintainer, etc for registry image storage

FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the NestJS application
RUN npm run build

# Expose the port
EXPOSE 3000

# Start the production server
CMD ["npm", "run", "start"]
