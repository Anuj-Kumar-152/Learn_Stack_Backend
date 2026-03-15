FROM node:22

# install java
RUN apt-get update && apt-get install -y openjdk-17-jdk

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 10000

CMD ["node", "server.js"]