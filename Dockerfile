# stage-0
FROM node:alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
COPY tsconfig.json ./

# Bundle app source
COPY src ./src

# Does clean install and build
RUN npm ci
RUN npm run build

# stage-1
FROM node:alpine

# as before, but no TS
WORKDIR /usr/src/app
COPY package*.json ./
COPY config ./config
COPY .env ./

# copy compiled JS
COPY --from=0 /usr/src/app/dist ./dist

# clean install, no dev
RUN npm ci --omit=dev

# Run node
CMD [ "node", "." ]