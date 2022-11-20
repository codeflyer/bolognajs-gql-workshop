'use strict'

const pino = require('pino')

module.exports = (options) => {
  return pino(
    {
      name: 'sample-project',
      level: options.level,
      prettyPrint: options.pretty,
      formatters: {
        level (label) {
          return { level: label.toUpperCase() }
        }
      }
    },
    pino.destination({ sync: false })
  )
}
