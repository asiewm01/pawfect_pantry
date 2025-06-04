FROM node:18

WORKDIR /app

# Copy dependency files first (for layer caching)
COPY package.json package-lock.json ./

# Install all dependencies (including cross-env)
RUN npm install

# Copy the rest of the source code
COPY . .

# Declare and pass build-time variable
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Build the app (must come AFTER setting the env var)
RUN npm run build

# Expose the port
EXPOSE 3001

# Start the app (optional if using serve or nginx in prod)
CMD ["npm", "start"]
