'use strict'

const path = require('path')
const mercurius = require('mercurius')
const fp = require('fastify-plugin')
const { loadFiles } = require('@graphql-tools/load-files')
const { makeExecutableSchema } = require('@graphql-tools/schema')

const loadSchema = async () => {
  const schema = await loadFiles(
    path.resolve(__dirname, '../modules/**/*.graphql')
  )

  const resolvers = (await loadFiles(
    path.resolve(__dirname, '../modules/**/resolvers.js')
  )).reduce((acc, resolver) => {
    Object.entries(resolver).forEach(([key, value]) => {
      if (!acc[key]) {
        acc[key] = {}
      }

      acc[key] = { ...acc[key], ...value }
    })

    return acc
  }, {})

  return { schema: makeExecutableSchema({ typeDefs: schema }), resolvers }
}

module.exports = fp(
  async (fastify, options) => {
    const { schema, resolvers } = await loadSchema()

    const mercuriusOptions = {
      graphiql: options.graphql.graphiql,
      schema,
      resolvers,
      context: async () => {
        return {
          app: fastify,
          config: fastify.config,
          logger: fastify.log
        }
      }
    }

    fastify.register(mercurius, mercuriusOptions)

    fastify.get('/sdl', async function () {
      const query = '{ _service { sdl } }'
      return fastify.graphql(query)
    })
  },
  {
    name: 'mercurius',
    dependencies: ['pg']
  }
)
