# Use official Node.js LTS image
FROM node:18

# Create app directory
WORKDIR /app

# Copy package.json and install deps
COPY package*.json ./
RUN npm install

# Copy the rest of your code
COPY . .

# Expose the port your server runs on
EXPOSE 8080

# Run your app
CMD ["node", "server.js"]