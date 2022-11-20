const SQL = require('@nearform/sql')
const {uniq} = require('lodash')
const LRU = require('lru-cache')

const cache = new LRU({
  max: 100,
  ttl: 1000 * 60 * 5,
})

module.exports = {
  Film: {
    categories: async (queries,context) => {
      const categoryList = queries.map(film => film.obj.category_id)

      const uniqIds = uniq(categoryList).sort()
      const key = `categories:${JSON.stringify(uniqIds)}`

      let data = cache.get(key)
      if(!data) {

        const query = SQL`
          SELECT c.category_id as id, c.name FROM category as c 
          WHERE c.category_id IN (${SQL.glue(uniqIds.map(id => SQL`${id}`), ',')})
        `

        const result = await context.app.pg.query(query)

        data = result.rows
        cache.set(key, data)
      }

      return categoryList.map(cat => {
        const cats = data.find(r => r.id === cat)
        return cats ? [cats] : []
      })
    }
  }
}
