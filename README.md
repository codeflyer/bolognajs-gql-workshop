# BolognaJS GraphQL Workshop

This project is a scaffolder for the GraphQL workshop

## Quickstart

```javascript
npm install
cp .env.sample .env
```

Set the environment `PG_CONNECTION_STRING` in the `.env` file with the connection string provided.

Run the app:
```javascript
npm run dev
```

Have fun!!

## Prepare the postgres DB

The workshop id done using the PostgraseSample database:
https://www.postgresqltutorial.com/postgresql-getting-started/postgresql-sample-database/

Create a Postgres instance and add the sample file
 * a local version using `docker`
 * a cloud instance for free: https://www.elephantsql.com/

Download the sample database: https://www.postgresqltutorial.com/wp-content/uploads/2019/05/dvdrental.zip

unzip the file and use the `dvdrental.tar` to intialize the db with the command:

```
pg_restore --host=lucky.db.elephantsql.com --username=suauakil --password --dbname=suauakil dvdrental.tar
```

On https://www.elephantsql.com/ the command should be run twice, it returns errors but the db will be initialized with the data required for the workshop.
