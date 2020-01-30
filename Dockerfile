FROM node:10

RUN apt-get update -y \
    && apt-get -y install curl apt-utils python build-essential git ca-certificates 

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install typescript -g

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]