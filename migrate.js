const pg = require('pg')
const path = require('path')
const parse = require('pg-connection-string').parse

const getConfig = require('./src/config')

const dynamicImport = async (packageName) => new Function(`return import('${packageName}')`)() // eslint-disable-line no-new-func

async function run (version) {
  console.log('Migration disabled')
  return
  /* eslint-disable no-unreachable */
  // Create a client of your choice
  const config = await getConfig()
  const client = new pg.Client({
    ...config.postgres
  })

  const dbValues = parse(config.postgres.connectionString)

  try {
    const Postgrator = (await dynamicImport('postgrator')).default
    // Establish a database connection
    await client.connect()

    // Create postgrator instance
    const postgrator = new Postgrator({
      migrationPattern: path.resolve(__dirname, 'migrations/*'),
      driver: 'pg',
      database: dbValues.database,
      schemaTable: 'schemaversion',
      execQuery: (query) => client.query(query)
    })

    console.log('MIGRATE TO ', version)
    const appliedMigrations = await postgrator.migrate(version)
    console.log(appliedMigrations)
  } catch (error) {
    console.error(error.appliedMigrations) // array of migration objects
  }

  await client.end()
}

run(process.argv[2] || 'max')
