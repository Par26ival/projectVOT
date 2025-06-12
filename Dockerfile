FROM node:18

# Set working directory
WORKDIR /app

# Install required dependencies
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Rebuild sqlite3 with Python available
RUN npm rebuild sqlite3 --build-from-source

# Copy the rest of the application
COPY . .

# Expose the app's port
EXPOSE 3000

# Command to start the app
CMD ["npm", "start"]