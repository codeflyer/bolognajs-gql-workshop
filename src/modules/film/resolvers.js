const SQL = require('@nearform/sql')
module.exports = {
  Query: {
    getFilmList: async (parent, params, context, info) => {
      const query = SQL`
        SELECT * from film LIMIT 5
      `

      const result = await context.app.pg.query(query)

      return result.rows
    }
  },
  Film: {
    id: (parent) => parent.film_id
  }
}
