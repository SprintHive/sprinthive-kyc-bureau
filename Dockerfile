FROM mhart/alpine-node:8 as buildroom

# Copy the whole repo into the app folder
WORKDIR /app
COPY . .

# Use yarn to make sure all our server dependencies are installed
WORKDIR /app
RUN yarn install --production

# Copy only the files we want from the build room to create our final image
# Note the final image is created from "base" so no build tools are included
FROM mhart/alpine-node:base-8

# Copy all the server dependencies
#WORKDIR /app/node_modules
COPY --from=buildroom /app/node_modules node_modules

# Copy the whole server
COPY --from=buildroom /app/src src

EXPOSE 8080

RUN ls -l

CMD NODE_ENV=production DEBUG=sprinthive:* PORT=8080 node src/server.js