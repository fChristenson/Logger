FROM node
MAINTAINER Fidde

RUN apt-get update && apt-get install -y npm

RUN npm install -g pm2

ENV LOGGER_PORT 80

EXPOSE 80

CMD bash