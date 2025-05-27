FROM node:18

WORKDIR /app

# Copy dependency files
COPY package.json package-lock.json ./

# Copy the rest of the source code
COPY . .

# Install all dependencies (including cross-env)
RUN npm install cross-env --save-dev

# Build the app
RUN npm run build

# Expose the port
EXPOSE 3001

# Start the app (optional if you're using Nginx or serve later)
CMD ["npm", "start"]

# Copy correct env file depending on build context
COPY .env.production .env



