'use strict'

const path = require('path')
const mercurius = require('mercurius')
const fp = require('fastify-plugin')
const {loadFiles} = require('@graphql-tools/load-files')
const {makeExecutableSchema} = require('@graphql-tools/schema')

const dynamicImport = async (packageName) =>
  new Function(`return import('${packageName}')`)() // eslint-disable-line no-new-func

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

      acc[key] = {...acc[key], ...value}
    })

    return acc
  }, {})

  const loaders = (await loadFiles(
    path.resolve(__dirname, '../modules/**/loaders.js')
  )).reduce((acc, loader) => {
    Object.entries(loader).forEach(([key, value]) => {
      if (!acc[key]) {
        acc[key] = {}
      }

      acc[key] = {...acc[key], ...value}
    })

    return acc
  }, {})

  return {schema: makeExecutableSchema({typeDefs: schema}), resolvers, loaders}
}

module.exports = fp(
  async (fastify, options) => {
    const {schema, resolvers, loaders} = await loadSchema()

    const explain = (await dynamicImport('mercurius-explain'))

    const mercuriusOptions = {
      graphiql: {
        enabled: true,
        plugins: [explain.explainGraphiQLPlugin()]
      },
      schema,
      resolvers,
      loaders,
      context: async () => {
        return {
          app: fastify,
          config: fastify.config,
          logger: fastify.log
        }
      }
    }

    fastify.register(mercurius, mercuriusOptions)

    fastify.register(explain.default, {})

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
