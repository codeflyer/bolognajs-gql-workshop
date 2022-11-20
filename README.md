# BolognaJS GraphQL Workshop

This project is a scaffolder for the GraphQL workshop

## Quickstart

Use node >= 16

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

## Steps

### First schema and simple resolver
```
git checkout step-01/simple-film-list
```

### Pass parameter to a query
```
git checkout step-02/advanced-film-list
```

### Add resolver to entity
```
git checkout step-03/film-categories
```

### Optimize the query with a loader
```
git checkout step-04/loader-optimization
```

### Add cache management to the query
```
git checkout step-05/cache-and-improvement
```

### Add access control
```
git checkout step-06/directive-auth
```

### Add validation to input types
```
git checkout step-07/directive-validation
```
