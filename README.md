# NodeJsRest

## Development server
### Run
* `npm i`
* `knex migrate:rollback`
* `knex migrate:latest`
* `knex seed:run`
* `npm start` for a dev server. Navigate to `http://localhost:3001/`.

## Docker
### Run
* `docker build -t node-js-rest .`
* `docker-compose up`
* `http://localhost:3001/setup` for migrate databe and seed.

## Stripe test card
### visa
4242424242424242 12/20 123