# Choose the Image which has Node installed already - testing
FROM node:latest

# COPY all the files from Current Directory into the Container
COPY ./ ./

# Install the Project Dependencies like Express Framework
RUN npm install

# Tell that this image is going to Open a Port 
EXPOSE 8082

# Default Command to launch the Application
CMD ["npm", "start"]