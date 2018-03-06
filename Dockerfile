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