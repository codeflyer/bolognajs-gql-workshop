const SQL = require('@nearform/sql')
module.exports = {
  Query: {
    getFilmList: async (parent, params, context, info) => {
      const limit = params.input.resultPerPage || 5
      const offset = (params.input.page || 0) * limit

      const query = SQL`
        SELECT * from film as f
        LEFT JOIN film_category as fg ON fg.film_id = f.film_id
        ORDER BY f.film_id
        LIMIT ${limit}
        OFFSET ${offset}
      `

      const result = await context.app.pg.query(query)

      return result.rows
    }
  },
  Film: {
    id: (parent) => parent.film_id,
    categories: async (parent, params, context, info) => {
      const query = SQL`
        SELECT * FROM category as c 
        WHERE c.category_id = ${parent.category_id}
      `

      const result = await context.app.pg.query(query)

      return result.rows
    }
  }
}
