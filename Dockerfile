#Specifying the base img:
FROM node:18 as build-stage

RUN mkdir /usr/app
COPY . /usr/app
WORKDIR /usr/app

RUN npm install
COPY package*.json ./
RUN npm install

RUN npm run build

#Stage2:
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=build-stage /usr/app/build .

ENTRYPOINT [ "nginx","-g","daemon off;" ]