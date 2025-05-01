FROM node:18.19.1-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install only the dependencies needed for the socket server
RUN npm install express socket.io cors

# Copy the socket server file
COPY socket-server.js ./

# Create a health check endpoint
RUN echo 'const express = require("express"); const app = express(); app.get("/health", (req, res) => { res.status(200).send("OK"); }); app.listen(3001, () => { console.log("Health check server running on port 3001"); });' > health-check.js

# Expose the port
EXPOSE 3001

# Start the socket server
CMD ["node", "socket-server.js"]
