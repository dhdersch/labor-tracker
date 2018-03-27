# Labor-Tracker
Labor Tracker Application

docker-compose up

API Base Path:
localhost:8080/


## Server
The server is built using the serverless framework and builds a single lambda behind one api gateway proxy.

To run the server locally:

Dependencies: 

1. node >= 8

Directions (within the /server directory): 

2. npm install
3. sls deploy --profile {your profile}


## Client

ng serve

localhost:4200


## Old stuff

FROM node

RUN apt-get update
RUN apt-get install -yqq default-jdk maven
RUN npm install angular-cli

# Init
RUN mkdir /app
WORKDIR /app
COPY ./ /app

WORKDIR /app/clients/web
RUN ls /app/clients/web
RUN ls
RUN $(npm bin)/ng build
WORKDIR /app

RUN mv /app/clients/web/dist /app/src/main/resources/static

RUN mvn clean install -DskipTests=true

CMD ["mvn", "spring-boot:run"]