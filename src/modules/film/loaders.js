const SQL = require('@nearform/sql')
module.exports = {
  Film: {
    categories: async (queries,context) => {
      const categoryList = queries.map(film => film.obj.category_id)

      const query = SQL`
        SELECT * FROM category as c 
        WHERE c.category_id IN (${SQL.glue(categoryList.map(id => SQL`${id}`), ',')})
      `

      const result = await context.app.pg.query(query)

      return categoryList.map(cat => {
        const cats = result.rows.find(r => r.category_id === cat)
        return cats ? [cats] : []
      })
    }
  }
}
