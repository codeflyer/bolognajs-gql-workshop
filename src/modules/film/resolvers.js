const SQL = require('@nearform/sql')
module.exports = {
  Query: {
    getFilmList: async (parent, params, context, info) => {
      const limit = params.input.resultPerPage || 5
      const offset = (params.input.page || 0) * limit

      const query = SQL`
        SELECT * from film 
        ORDER BY film_id
        LIMIT ${limit}
        OFFSET ${offset}
      `

      const result = await context.app.pg.query(query)

      return result.rows
    }
  },
  Film: {
    id: (parent) => parent.film_id
  }
}
