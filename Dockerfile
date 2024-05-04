# Stage 1: Build the frontend in a Node.js environment
FROM node:18-alpine as frontend-build

# Set the working directory for the frontend build
WORKDIR /app/frontend

# Copy package.json and package-lock.json (or yarn.lock)
COPY fe/package*.json ./

# Install frontend dependencies
RUN npm install
RUN npm install -g typescript
RUN npm i --save-dev @types/node

# Copy the frontend source files
COPY fe/ .

# Build the frontend
RUN npm run build

# Stage 2: Set up the backend environment
FROM node:18-alpine

# Set the working directory for the backend
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) from the backend
COPY be/package*.json ./

# Install backend dependencies
RUN npm install
RUN npm install -g ts-node
RUN npm uninstall bcrypt 
RUN npm install bcrypt

# Copy the backend source files
COPY be/ .

# Copy the built frontend files from the frontend-build stage
COPY --from=frontend-build /app/frontend/dist /app/src/dist

# Expose the port the backend listens on
EXPOSE 8080

# Command to start the backend
CMD ["npm", "start"]
