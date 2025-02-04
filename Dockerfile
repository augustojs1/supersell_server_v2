FROM node:18.20.2-alpine

WORKDIR /usr/app

COPY package*.json ./

COPY . .

EXPOSE 8000

CMD ["npm", "run", "start"]
