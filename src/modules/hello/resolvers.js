module.exports = {
  Query: {
    hello: (parent, params, context, info) => `Hello ${params.name}`
  }
}
