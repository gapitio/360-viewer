FROM node:alpine as BUILD_IMAGE

WORKDIR /usr/src/app

COPY package*.json ./

# install dependencies
RUN npm ci

COPY . .

# build application
RUN npm run build

# remove development dependencies
RUN npm prune --production

FROM node:alpine

WORKDIR /usr/src/app

# copy from build image
COPY --from=BUILD_IMAGE /usr/src/app/package*.json ./
COPY --from=BUILD_IMAGE /usr/src/app/public ./public
COPY --from=BUILD_IMAGE /usr/src/app/node_modules ./node_modules

EXPOSE 5000

CMD [ "npm", "run", "start" ]
