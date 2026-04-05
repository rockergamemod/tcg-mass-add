FROM mcr.microsoft.com/playwright:v1.49.1-noble

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Create a downloads directory
RUN mkdir -p downloads

# Set environment variables
ENV NODE_ENV=production
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1

# The command to run the automation
CMD ["npm", "start"]
