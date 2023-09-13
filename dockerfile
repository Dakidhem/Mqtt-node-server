# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application code into the container
COPY . .

# Build the Next.js application
RUN npm run build

# Set the environment variable for the port
ENV PORT 3000

# Expose the port that the app will run on
EXPOSE $PORT

# Start the Next.js application
CMD ["npm", "start"]