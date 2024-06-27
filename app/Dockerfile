# app/Dockerfile
FROM node:18-alpine as build-stage

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project
COPY . .

# Build the application
RUN npm run build

# Expose port (optional - not necessary if using docker run -p)
EXPOSE 8080

# Command to run the application
CMD ["npm", "run", "serve"]
