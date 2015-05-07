FROM node

MAINTAINER Fidde

COPY . /logger

WORKDIR /logger

EXPOSE 3000

CMD node server.js