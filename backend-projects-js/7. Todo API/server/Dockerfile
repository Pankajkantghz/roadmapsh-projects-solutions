# Use a lightweight Node LTS base image running on Linux Alpine
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package management descriptors first to leverage Docker layer caching
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Compile TypeScript source code into production JavaScript
RUN npm run build

# Expose the API engine network port
EXPOSE 3000

# Fire up the compiled backend server
CMD ["npm", "start"]