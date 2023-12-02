# Use a base image
FROM node:20.9.0

# Set the working directory
WORKDIR /app

# Copy the source code to the working directory
COPY . .

# Install dependencies (if any)
RUN npm install

# Expose a port (if needed)
EXPOSE 3000

# Define the command to run the application
CMD ["npm", "start"]
