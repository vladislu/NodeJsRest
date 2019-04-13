FROM node:8.15.0-jessie

WORKDIR /home/node/app
COPY package*.json ./
RUN npm install

COPY . ./

CMD ["npm", "start"]