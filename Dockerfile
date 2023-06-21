FROM node:alpine
ENV NODE_ENV=production

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Does clean install, --omit=dev comes from setting NODE_ENV
RUN npm ci

# Bundle app source
COPY . .

CMD [ "npx", "ts-node", "." ]