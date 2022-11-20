'use strict'
const fp = require('fastify-plugin')

async function plugin (server, options) {
  server
    .register(require('@fastify/postgres'), {
      ...options.postgres,
      max: 1,
    })
}

module.exports = fp(plugin, {
  name: 'pg'
})
