const express = require('express')
const app = express()

const products = require('./products.json')
const users = require('./users.json')

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

// GET list of products based on a set of tags and/or a search
app.get('/products', (req, res) => {
  const type = req.query.type
  const search = req.query.search
  const results = []
  for (let i of products) {
    if (check_product(i, search, type)) {
      results.push(`{"name":"${i.name}", "thumbnail": "${i.thumbnail}"}`)
    }
  }
  res.send(results)
})

// GET details of a specific product
app.get("/product", (req, res) => {
  const product = req.query.name
  let found = false
  for (let i of products){
    if (product == i.name){
      res.send(i)
      found = true
      break
    }
  }
  if (!found) res.sendStatus(404)
})

// POST a new product to the server
app.post("/new-product", (req, res) => {
  console.log("New Product")
  console.log(req.body)
  data = req.body
  const n_name = data["new-name"]
  const n_tags = data["new-tags"]
  const n_thumbnail = data["new-thumbnail"]
  const n_description = data["new-description"]
  const n_links = data["new-links"]
  const n_owner = data["new-owner"]
  const n_extras = data["new-name"]
})

app.get('/tags', (req, res) => {
  const results = []
  for (let i of products) {
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
  const f = new File([src], '/files/' + src)
  try {
    res.sendFile(src, { root: './files' })
  } catch (e) {
    console.log('cant find')
    console.log(e)
    res.sendStatus(404)
  }
})

app.get("/login", (req, res) => {
  const username = req.query.username
  const password = req.query.password
  let found = false
  for (var i of users){
    if (username == i.username){
      found = true
      break
    }
  }
  if (found){
    if (password == i.password){
      res.send(i)
    } else {
      res.sendStatus(401)
    }
  } else {
    res.sendStatus(404)
  }
})

module.exports = app
