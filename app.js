const express = require('express')
const app = express()

const products = require('./products.json')
const users = require('./users.json')

function check_target (target, term, type) {
  switch (type) {
    case 'name':
      if (target.name.toLowerCase().includes(term)) {
        return true
      }
      break
    case 'tags':
      if (target.tags.includes(term)) {
        return true
      }
      break
    case 'owner':
      if (target.owner == term) {
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
  const method_ = req.query.method
  const search_ = req.query.search
  const results = []
  for (let i of products) {
    if (check_target(i, search_, method_)) {
      results.push(JSON.parse(`{"name":"${i.name}", "image": "${i.image}"}`))
    }
  }
  res.send(results)
})

// GET details of a specific product
app.get("/product", (req, res) => {
  const product_ = req.query.name
  let found = false
  for (let i of products){
    if (product_ == i.name){
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

// GET List of users/companies
app.get("/users", (req, res) => {
  const method_ = req.query.method
  const search_ = req.query.search
  const results = []
  for (let i of users) {
    if (check_target(i, search_, method_)) {
      results.push(JSON.parse(`{"name":"${i.name}", "image": "${i.image}"}`))
    }
  }
  res.send(results)
})

// GET details of a specific user
app.get("/user", (req, res) => {
  const user_ = req.query.name
  let found = false
  for (let i of users){
    if (user_ == i.name){
      console.log(i)
      let copy = JSON.parse(JSON.stringify(i))
      delete copy.password
      console.log(copy)
      res.send(copy)
      found = true
      console.log(i)
      break
    }
  }
  if (!found) res.sendStatus(404)
})

app.get('/tags', (req, res) => {
  const type_ = req.query.type
  const results = []
  for (let i of eval(type_)) {
    for (j of i.tags) {
      if (!results.includes(j)) {
        results.push(j)
      }
    }
  }
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
    if (username == i.name){
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
