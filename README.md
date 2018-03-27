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