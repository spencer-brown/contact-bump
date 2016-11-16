FROM node:latest

# Create dir for app code.
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Copy app source
COPY . /usr/src/app

# Expose app port
EXPOSE 3000

# Run app start command
CMD npm install && npm start
