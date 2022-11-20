'use strict'

const path = require('path')

const pino = require('pino')
const envSchema = require('env-schema')
const S = require('fluent-json-schema')

const dotenv =
  process.env.NODE_ENV === 'test'
    ? { path: path.resolve(__dirname, '../test/.env') }
    : true

const envVariables = envSchema({
  schema: S.object()
    .prop('NODE_ENV', S.string().default('development'))

    .prop('PG_CONNECTION_STRING', S.string().required())
    .prop('FASTIFY_PORT', S.number().default(3001))
    .prop(
      'FASTIFY_LOG_LEVEL',
      S.string().enum(Object.values(pino().levels.labels))
    )
    .prop('DISABLE_REQUEST_LOGGING', S.boolean().default(false))

    .prop('GRAPHQL_PLAYGROUND', S.boolean().default(false)),

  dotenv
})

async function getConfig () {
  return {
    env: envVariables.NODE_ENV,
    log: {
      level: envVariables.FASTIFY_LOG_LEVEL || 'info',
      disableRequestLogging: envVariables.DISABLE_REQUEST_LOGGING
    },
    postgres: {
      connectionString: envVariables.PG_CONNECTION_STRING
    },
    app: {
      port: envVariables.FASTIFY_PORT
    },
    autoload: [{ path: path.join(__dirname, './plugins') }],
    graphql: {
      dir: path.join(__dirname, '../gql'),
      graphiql: envVariables.GRAPHQL_PLAYGROUND,
      federationMetadata: false
    },
    thirdParty: []
  }
}

module.exports = getConfig
