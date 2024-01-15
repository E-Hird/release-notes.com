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

app.get('/products', (req, res) => {
  const type = req.query.type
  const search = req.query.search
  const results = []
  for (let i of products) {
    if (check_product(i, search, type)) {
      results.push(i)
    }
  }
  res.send(results)
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
  const f = new File([src], '/images/' + src)
  try {
    res.sendFile(src, { root: './images' })
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
