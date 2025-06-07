# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the application source code
COPY . .

# Expose the port the app listens on
EXPOSE 5000

# Command to run the application
CMD [ "node", "index.js" ]

