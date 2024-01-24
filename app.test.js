'user-strict'

const request = require('supertest')
const app = require('./app')

describe('Test Product requests', () => {
  test('GET /products succeeds', () => {
    return request(app)
      .get('/products?method=name&search=')
      .expect(200)
  })
  test('GET /products returns JSON', () => {
    return request(app)
      .get('/products?method=name&search=')
      .expect('Content-type', /json/)
  })

  test('GET /product succeeds', () => {
    return request(app)
      .get('/product?name=productname')
      .expect(200)
  })
  test('GET /product returns JSON', () => {
    return request(app)
      .get('/product?name=productname')
      .expect('Content-type', /json/)
  })
  test('GET /product returns 404 when bad name', () => {
    return request(app)
      .get('/product?name=ThisIs100%DefinitelyNeverEverEverEverEverEverEVrEVREeverGoignToBeAProductname')
      .expect(404)
  })

  test('POST /new-product', () => {
    return request(app)
      .post('/new-product')
      .field("name", "New Product")
      .field("tags", `["Tags"]`)
      .field("description", 'Description of the product')
      .field("links", `[{ "text": "Link Text", "url": "http://link.url/" }]`)
      .field("owner", 'username')
      .field("extras", "[]")
      .field("test", "true")
      .expect(201)
  })
})

describe('Test User requests', () => {
    test('GET /users succeeds', () => {
      return request(app)
        .get('/users?method=name&search=')
        .expect(200)
    })
    test('GET /users returns JSON', () => {
      return request(app)
        .get('/users?method=name&search=')
        .expect('Content-type', /json/)
    })
  
    test('GET /user succeeds', () => {
      return request(app)
        .get('/user?name=username')
        .expect(200)
    })
    test('GET /user returns JSON', () => {
      return request(app)
        .get('/user?name=username')
        .expect('Content-type', /json/)
    })
    test('GET /user returns 404 when bad name', () => {
        return request(app)
          .get('/user?name=ThisIs100%DefinitelyNeverEverEverEverEverEverEVrEVREeverGoignToBeAUsername')
          .expect(404)
      })
  
    test('POST /new-user', () => {
      return request(app)
        .post('/new-user')
        .field("name", "New Product")
        .field("password", "Password1234")
        .field("tags", `["Tags"]`)
        .field("description", 'Description of the user')
        .field("links", `[{ "text": "Link Text", "url": "http://link.url/" }]`)
        .field("test", "true")
        .expect(201)
    })
})

describe('Test Tags request', () => {
    test('GET /tags succeeds', () => {
        return request(app)
          .get('/tags?type=products')
          .expect(200)
      })
      test('GET /tagss returns JSON', () => {
        return request(app)
          .get('/tags?type=users')
          .expect('Content-type', /json/)
      })
})

describe('Test File request', () => {
    test('GET /file succeeds', () => {
        return request(app)
          .get('/file?src=Cow.png')
          .expect(200)
      })
      test('GET /file returns a file', () => {
        return request(app)
          .get('/file?src=Cow.png')
          .expect('Content-type', /image/)
      })

      test('GET /file returns 404 when file doesn\'t exist', () => {
        return request(app)
          .get('/file?src=notAFile')
          .expect(404)
      })
})

describe('Test Login request', () => {
    test('GET /login succeeds with the correct credentials', () => {
        return request(app)
          .get('/login?username=username&password=password')
          .expect(200)
      })
      test('GET /login returns JSON', () => {
        return request(app)
          .get('/login?username=username&password=password')
          .expect('Content-type', /json/)
      })
      test('GET /login returns 404 if user doesn\'t exist', () => {
        return request(app)
          .get('/login?username=DefinitelyNeverEverEvere100%evergoingTobeaUsername&password=1234')
          .expect(404)
      })
      test('GET /login returns 401 with incorrect credentials', () => {
        return request(app)
          .get('/login?username=username&password=notMyPassword')
          .expect(401)
      })
})