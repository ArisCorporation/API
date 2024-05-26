# Use the official Node.js LTS Alpine image as the base image
FROM node:lts-alpine

# Update the package list and install ffmpeg
RUN apk update && apk add ffmpeg

# Create the /usr/src/app directory in the container
RUN mkdir -p /usr/src/app

# Set /usr/src/app as the working directory
WORKDIR /usr/src/app

# Copy the package.json file from your host to the present location (.) in your image (i.e., /usr/src/app/)
COPY package.json /usr/src/app/

# Install the 'forever' package globally
RUN npm install forever -g

# Install the dependencies in the package.json
RUN npm install

# Copy the rest of your app's source code from your host to your image filesystem.
COPY . /usr/src/app

# Expose port 8080 in the container
EXPOSE 8080

# Define the command to run your app using CMD which defines your runtime.
CMD [ "npm", "start" ]