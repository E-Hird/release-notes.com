const express = require('express')
const app = express()

const products = require('./products.json')

function check_product (product, term, type) {
  switch (type) {
    case 'name':
      if (product.name.toLowerCase().includes(term)) {
        return true
      }
      break
    case 'tags':
      if (product.tags.includes(term)) {
        return true
      }
      break
    case 'owner':
      if (product.owner.toLowerCase().includes(term)) {
        return true
      }
      break
    default:
      break
  }
  return false
}

app.use(express.static('client'))
app.use(express.urlencoded())

app.get('/products', (req, res) => {
  const type = req.query.type
  const search = req.query.search
  const results = []
  for (const i of products) {
    if (check_product(i, search, type)) {
      results.push(i)
    }
  }
  res.send(results)
})

app.get('/tags', (req, res) => {
  const results = []
  for (i of products) {
    for (j of i.tags) {
      console.log(j)
      if (!results.includes(j)) {
        results.push(j)
      }
    }
  }
  console.log(results)
  res.send(results)
})

app.get('/file', (req, res) => {
  const src = req.query.src
  const f = new File([src], '/images/' + src)
  try {
    res.sendFile(src, { root: './images' })
  } catch (e) {
    console.log('cant find')
    console.log(e)
    res.sendStatus(404)
  }
})

module.exports = app
