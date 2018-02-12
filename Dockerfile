FROM node:latest

# RUN apt-get update -qq && apt-get install -y build-essential

RUN mkdir /src

RUN npm install gulp -g

WORKDIR /src
# ADD app/package.json /src/package.json

COPY . /src

RUN npm install

EXPOSE 8080
EXPOSE 35729

# CMD ["npm", "start"]
