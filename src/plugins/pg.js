'use strict'
const fp = require('fastify-plugin')

async function plugin (server, options) {
  server
    .register(require('@fastify/postgres'), {
      ...options.postgres
    })
}

module.exports = fp(plugin, {
  name: 'pg'
})
