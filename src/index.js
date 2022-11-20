'use strict'

const fastify = require('fastify')
const closeWithGrace = require('close-with-grace')

const getConfig = require('./config')
const logger = require('./logger')
const services = require('./app')

async function run () {
  const config = await getConfig()

  const app = fastify({
    logger: logger(config.log),
    disableRequestLogging: config.log.disableRequestLogging
  })

  app.register(services(config))

  const closeListeners = closeWithGrace(
    { delay: 500 },
    async function ({ err }) {
      if (err) {
        app.log.error({ msg: 'error closing app', err })
      }
      await app.close()
      app.log.info({ msg: 'app closed' })
    }
  )

  app.addHook('onClose', (instance, done) => {
    closeListeners.uninstall()
    done()
  })

  try {
    await app.listen({ port: config.app.port, host: 'localhost' })
  } catch (err) {
    app.log.fatal({ msg: 'error starting app', err })
    process.exit(1)
  }
}

run()
