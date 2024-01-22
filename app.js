const express = require('express')
const app = express()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const { userInfo } = require('os')

// Taken from refine example https://refine.dev/blog/how-to-multipart-upload/#example
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + "/files");
  },
  filename: (req, file, cb) => {
    let fn = file.originalname.split(path.extname(file.originalname))[0] + '-' + Date.now() + path.extname(file.originalname)
    cb(null, fn);
  },
});

const upload = multer({ storage: storage });

const productFile = './products.json'
const userFile = './users.json'

const products = JSON.parse(fs.readFileSync(productFile))
const users = JSON.parse(fs.readFileSync(userFile))

function checkTarget (target, term, type) {
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
      if (target.owner === term) {
        return true
      }
      break
    default:
      break
  }
  return false
}

app.use(express.static('client'))

class Product{
  constructor(name_, image_, tags_, description_, links_, extras_){
    this.name = name_
    this.image = image_
    this.tags = tags_
    this.description = description_
    this.links = links_
    this.owner = owner
    this.extras = extras_
  }
}
class User{
  constructor(name_, password_, image_, tags_, description_, links_){
    this.name = name_
    this.password = password_
    this.image = image_
    this.tags = tags_
    this.description = description_
    this.links = links_
  }
}

// GET list of products based on a set of tags and/or a search
app.get('/products', (req, res) => {
  const method_ = req.query.method
  const search_ = req.query.search
  const results = []
  for (const i of products) {
    if (checkTarget(i, search_, method_)) {
      results.push(JSON.parse(`{"name":"${i.name}", "image": "${i.image}"}`))
    }
  }
  res.send(results)
})

// GET details of a specific product
app.get('/product', (req, res) => {
  const product_ = req.query.name
  let found = false
  for (const i of products) {
    if (product_ === i.name) {
      res.send(i)
      found = true
      break
    }
  }
  if (!found) res.sendStatus(404)
})

// POST a new product to the server
app.post('/new-product', upload.any("imageFile"), (req, res) => {
  console.log('New Product')
  const data = req.body
  let nameTaken = false
  for (i of products){
    if (data.name === i.name){
      nameTaken = true
      break
    }
  }
  if (nameTaken){
    res.sendStatus(409)
  } else {
    const imageName = (req.file !== undefined)?req.file.filename:"image"
    const newProduct = new Product(data.name, imageName, JSON.parse(data.tags), data.description, JSON.parse(data.links), JSON.parse(data.extras))
    products.push(newProduct)
    fs.writeFileSync(productFile, JSON.stringify(products))
    res.sendStatus(201)
  }
})

// GET List of users/companies
app.get('/users', (req, res) => {
  const method_ = req.query.method
  const search_ = req.query.search
  const results = []
  for (const i of users) {
    if (checkTarget(i, search_, method_)) {
      results.push(JSON.parse(`{"name":"${i.name}", "image": "${i.image}"}`))
    }
  }
  res.send(results)
})

// GET details of a specific user
app.get('/user', (req, res) => {
  const user_ = req.query.name
  let found = false
  for (const i of users) {
    if (user_ === i.name) {
      const copy = JSON.parse(JSON.stringify(i))
      delete copy.password
      res.send(copy)
      found = true
      break
    }
  }
  if (!found) res.sendStatus(404)
})

// POST a new user to the server
app.post('/new-user', upload.any("imageFile"), (req, res) => {
  console.log('New User')
  const data = req.body
  let nameTaken = false
  for (i of users){
    if (data.name === i.name){
      nameTaken = true
      break
    }
  }
  if (nameTaken){
    res.sendStatus(409)
  } else {
    const imageName = (req.file !== undefined)?req.file.filename:"image"
    const newUser = new User(data.name, data.password, imageName, JSON.parse(data.tags), data.description, JSON.parse(data.links))
    users.push(newUser)
    fs.writeFileSync(userFile, JSON.stringify(users))
    res.sendStatus(201)
  }
})

app.get('/tags', (req, res) => {
  const type_ = (req.query.type === 'products') ? products : users
  const results = []
  for (const i of type_) {
    for (const j of i.tags) {
      if (!results.includes(j)) {
        results.push(j)
      }
    }
  }
  res.send(results)
})

app.get('/file', (req, res) => {
  const src = req.query.src
  try {
    res.sendFile(src, { root: './files' })
  } catch (e) {
    console.log('cant find')
    console.log(e)
    res.sendStatus(404)
  }
})

app.get('/login', (req, res) => {
  const username = req.query.username
  const password = req.query.password
  let found = false
  for (var i of users) {
    if (username === i.name) {
      found = true
      break
    }
  }
  if (found) {
    if (password === i.password) {
      res.send(i)
    } else {
      res.sendStatus(401)
    }
  } else {
    res.sendStatus(404)
  }
})

module.exports = app
