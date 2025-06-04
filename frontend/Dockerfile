# Stage 1: Build the React app
FROM node:18 AS builder

WORKDIR /app

# Copy dependency files first
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Accept build-time environment variable
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Build the app using the API URL
RUN npm run build

# Stage 2: Serve the app using a static server
FROM node:18 AS production

WORKDIR /app

# Install static file server
RUN npm install -g serve

# Copy the built React app from previous stage
COPY --from=builder /app/build ./build

# Expose port
EXPOSE 3000

# Serve the static build
CMD ["serve", "-s", "build", "-l", "3000"]

