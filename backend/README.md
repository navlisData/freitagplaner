# FreiTagPlaner backend

This is the Node.js backend for the FreiTagPlaner project.
It fetches and stores data from the *Feiertage API* (https://feiertage-api.de/) and provides an API for the Vue frontend.

## Deployment

The backend is deployed as a **Docker container** via **docker-compose**.

The container uses the **node:lts-bullseye-slim** base image from Dockerhub.

To start the backend:
```
docker-compose up -d
```

To stop the backend:
```
docker-compose down
```

## API

The backend has the following endpoints:

### Get holidays by year and country

There are two parameters used to filter the query: **year** and **country**.

If not specified, the year defaults to 2024 and the country to BW.

The url is structured in the following way:

*http://localhost:8081/holidays?year=2023&country=BW*

It can also be called without the two parameters

*http://localhost:8081/holidays*

Or only one parameter:

*http://localhost:8081/holidays?year=2024*