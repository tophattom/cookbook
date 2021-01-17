FROM node:14-alpine

RUN npm install -g sass

RUN mkdir -p /app
WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY client ./client
COPY Gruntfile.js .

RUN npm run build

COPY index.js .
COPY config.json .

CMD ["node", "index.js"]
