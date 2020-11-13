FROM node:14.13.0
WORKDIR /usr/src/app
COPY package*.json ./

RUN npm ci
COPY . .
RUN npm run build
EXPOSE 5000

CMD [ "npm", "run", "start" ]
