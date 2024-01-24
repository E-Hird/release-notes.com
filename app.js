// Initialize all required modules
const express = require('express')
const app = express()
const multer = require('multer')
const path = require('path')
const fs = require('fs')

// Taken from refine example https://refine.dev/blog/how-to-multipart-upload/#example
// Set up how posted files will be stored
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '/files'))
  },
  filename: (req, file, cb) => {
    const fn = (file.originalname.split(path.extname(file.originalname))[0] + '-' + Date.now() + path.extname(file.originalname))
    cb(null, fn)
  }
})

const upload = multer({ storage })

// Set up entity arrays
const productFile = './products.json'
const userFile = './users.json'

const products = JSON.parse(fs.readFileSync(productFile))
const users = JSON.parse(fs.readFileSync(userFile))

// Deliver the client side to the browser
app.use(express.static('client'))

// Check wether an item fits a search criteria
function checkTarget (target, term, type) {
  switch (type) {
    case 'name':
      if (target.name.toLowerCase().includes(term)) { // For name check if it includes the search term
        return true
      }
      break
    case 'tags':
      if (target.tags.includes(term)) { // For tags check for an exact match with the search tag
        return true
      }
      break
    case 'owner':
      if (target.owner === term) { // For owner heck for an exact match with the search owner
        return true
      }
      break
    default:
      break
  }
  return false // If not eligible return false
}

// Product object type
class Product {
  constructor (name_, image_, tags_, description_, links_, owner_, extras_) {
    this.name = name_
    this.image = image_
    this.tags = tags_
    this.description = description_
    this.links = links_
    this.owner = owner_
    this.extras = extras_
  }
}
// User object type
class User {
  constructor (name_, password_, image_, tags_, description_, links_) {
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
  for (const i of products) { // Search products for any that fit the search criteria
    if (checkTarget(i, search_, method_)) {
      results.push(JSON.parse(`{"name":"${i.name}", "image": "${i.image}"}`))
    }
  }
  res.send(results) // Send the names and images of the eligible products
})

// GET details of a specific product
app.get('/product', (req, res) => {
  const product_ = req.query.name
  let found = false
  for (const i of products) { // Search the products for the requested product
    if (product_ === i.name) {
      res.send(i) // Send a json object of the product
      found = true
      break
    }
  }
  if (!found) res.sendStatus(404) // If the product does not exist send 404
})

// POST a new product to the server
app.post('/new-product', upload.any('imageFile'), (req, res) => {
  console.log('New Product')
  const data = req.body // Receive the POST form data
  let nameTaken = false
  for (const i of products) {
    if (data.name === i.name) { // If there is already a product with the given name cancel the post request
      nameTaken = true
      break
    }
  }
  const imageName = (req.files[0] !== undefined) ? req.files[0].filename : 'image' // imageName defaults to 'image' if not file has been provided
  if (nameTaken) {
    if (req.files[0] !== undefined) { fs.unlinkSync(`./files/${imageName}`) } // If name is taken remove the uploaded image file and send 409
    res.sendStatus(409)
  } else { // Push the new product as a json object into the products array, and then save that to the products.json file, send 201
    const newProduct = new Product(data.name, imageName, JSON.parse(data.tags), data.description, JSON.parse(data.links), data.owner, JSON.parse(data.extras))
    if (data.test === undefined) {
      products.push(newProduct)
      fs.writeFileSync(productFile, JSON.stringify(products))
    }
    res.sendStatus(201)
  }
})

// GET List of users/companies
app.get('/users', (req, res) => {
  const method_ = req.query.method
  const search_ = req.query.search
  const results = []
  for (const i of users) {
    if (checkTarget(i, search_, method_)) { // Search users for any that fit the search criteria
      results.push(JSON.parse(`{"name":"${i.name}", "image": "${i.image}"}`))
    }
  }
  res.send(results) // Send the names and images of the eligible users
})

// GET details of a specific user
app.get('/user', (req, res) => {
  const user_ = req.query.name
  let found = false
  for (const i of users) { // Search the users for the requested user
    if (user_ === i.name) {
      const copy = JSON.parse(JSON.stringify(i))
      delete copy.password // Omit the password of the user from the response for security
      res.send(copy) // Send a json object of the user
      found = true
      break
    }
  }
  if (!found) res.sendStatus(404) // If the user does not exist send 404
})

// POST a new user to the server
app.post('/new-user', upload.any('imageFile'), (req, res) => {
  console.log('New User')
  const data = req.body // Receive the POST form data
  let nameTaken = false
  for (const i of users) {
    if (data.name === i.name) { // If there is already a user with the given name cancel the post request
      nameTaken = true
      break
    }
  }
  const imageName = (req.files[0] !== undefined) ? req.files[0].filename : 'image' // imageName defaults to 'image' if not file has been provided
  if (nameTaken) {
    if (req.files[0] !== undefined) { fs.unlinkSync(`./files/${imageName}`) } // If name is taken remove the uploaded image file and send 409
    res.sendStatus(409)
  } else { // Push the new user as a json object into the users array, and then save that to the users.json file, send 201
    const newUser = new User(data.name, data.password, imageName, JSON.parse(data.tags), data.description, JSON.parse(data.links))
    if (data.test === undefined) {
      users.push(newUser)
      fs.writeFileSync(userFile, JSON.stringify(users))
    }
    res.sendStatus(201)
  }
})

// GET a list of tags for an entity type
app.get('/tags', (req, res) => {
  const type_ = (req.query.type === 'products') ? products : users // default to users
  const results = []
  for (const i of type_) { // Cycle through each item
    for (const j of i.tags) { // Cycle through each of the items tags
      if (!results.includes(j)) { // If the tag is not in the results array push it
        results.push(j)
      }
    }
  }
  res.send(results) // Send a json array of the tags
})

// GET a file from the /files directory
app.get('/file', (req, res) => {
  const src = req.query.src
  try { // Send the file with the requested name
    res.sendFile(src, { root: './files' })
  } catch (e) { // If the file does not exist send a 404
    console.log(e)
    res.sendStatus(404)
  }
})

// GET the info of a user if they use the correct login credentials
app.get('/login', (req, res) => {
  const username = req.query.username
  const password = req.query.password
  let found = false
  for (var i of users) {
    if (username === i.name) { // Check if there exists a user with the given username
      found = true
      break
    }
  }
  if (found) {
    if (password === i.password) { // Check if the given password matches the given username
      res.send(i) // If yes send the user data
    } else {
      res.sendStatus(401) // If no send a 401
    }
  } else {
    res.sendStatus(404) // If the user does not exist send a 404
  }
})

module.exports = app
