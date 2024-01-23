# release-notes.com
A Webapp that compiles the Release Information for a wide range of products and services into one navigable site.

# API

# Products

## GET /products
Returns a list of JSON product objects containing product names and corresponding thumbnails filtered to a defined filter of either name, owner or tags of the product.

### Endpoint URL
> http://api.release-notes.com/products?method=methodType&search=searchTerm

### Query Parameters
| Name | Type | Description |
| -------- | -------- | -------- |
| `method`: Required | String | Defines how to filter the results. Can be `name`, `tags` or `owner`. Using `name` the server will search for products that contain the search term in their `name` attribute. Using `tags` the server will search for products that contain an exact match to the search term in its `tags` attribute. Using `owner` the server will search for products that have an exact match to the search term as its `owner` attribute. |
| `search`: Required | String | The search term that will be used to filter products. |

### Example code
```
(async () => {
  try {
    const searchResults = await fetch("/products?method=name&search=")
    console.log(await searchResults.json())
  } catch (error) {
    console.log(error);
  }
})();
```
Above will return a list of all products
### Example Response
```
[
    {
        "name": "product1Name",
        "image": "product1.png"
    }
    {
        "name": "product2Name",
        "image": "product2.png"
    }
]
```
### Response Fields
| Name | Type | Description |
| -------- | -------- | -------- |
| `name` | String | The unique name of the product. |
| `image` | String | A reference to the image file stored in the servers `/files` folder |

## GET /product
Returns a JSON object containing the details of a specific product.

### Endpoint URL
> http://api.release-notes.com/product?name=productName

### Query Parameters
| Name | Type | Description |
| -------- | -------- | -------- |
| `name`: Required | String | The name of the product. Server will find a product with an exact match to the `name` attribute. |

### Example code
```
(async () => {
  try {
    const productDetails = await fetch("/product?name=productName")
    console.log(await productDetails.json())
  } catch (error) {
    console.log(error);
  }
})();
```

### Example Response
```
{
    "name": "Product Name",
    "tags": ["Product", "Tags"],
    "image": "productImage.png",
    "description": "This is a description of the product",
    "links": [{"text": "Displayed Text", "url": "http://link.url/"}],
    "owner": "Big Company LTD"
    "extras": []
}
```
### Response Fields
| Name | Type | Description |
| -------- | -------- | -------- |
| `name` | String | The unique name of the product. |
| `tags` | Array | The list of tags associated with the product. Each tag is stored a string. |
| `image` | String | A reference to the image file stored in the servers `/files` folder. |
| `description` | String | The description of the product. |
| `links` | Array | The list of links attached to the product. Links are stored as JSON objects containing a `text` attribute referring to the text that the link is displayed as, and a `url` attribute referring to the `href` of the link. |
| `owner` | String | The name of the creator of the product. |
| `extras` | Array | A list of objects attached to a product. Can be used to store references to blog posts, videos, galleries, etc. |

## POST /new-product
Add a new product for the server to store. Data is posted as FormData.

### Endpoint URL
> http://api.release-notes.com/new-product

### Body Parameters
| Name | Type | Description |
| -------- | -------- | -------- |
| `name`: Required | String | The name of the product. |
| `tags`: Required | Array | A list of tags associated with the product. Tags must be in the form of a string, i.e. `"Tag"`. |
| `description`: Required | String | The description of the product. |
| `links`: Required | Array | A list of links attached to the product. Tags must be in a JSON object of the form `{"text": "Display Text", "url":"http://link.url/"}`.  |
| `owner`: Required | String | The name owner of the product. |
| `extras`: Required | Array | A list of references to extra features of the product, i.e. blog posts, videos, galleries |
| `imageFile`: | File | The thumbnail for the product. If no image file is found the server will default to `image` which will return a `404` when requested. |

### Example code
```
(async () => {
  try {
    const formData = new FormData()
    const imageFile = document.getElementById("imageInput").files[0]
    formData.append("imageFile", imageFile, imageFile.name)
    formData.append("name", name_)
    formData.append("tags", `[${tags_}]`)
    formData.append("description", description_)
    formData.append("links", `[${links_}]`)
    formData.append("owner", owner_)
    formData.append("extras", "[]")

    const postResponse = await fetch("/new-product", {
    method: "POST",
    body: formData
    })
    console.log(postResponse.status+": "+postResponse.statusText)
  } catch (error) {
    console.log(error);
  }
})();
```

### Example Response
```
201: Created
```
### Response Fields
| Name | Type | Description |
| -------- | -------- | -------- |
| `status` | Integer | The status code of the response. Basic codes are `201: Created` for product successfully created and `409: Conflict` for when the user tries to upload a product with the exact `name` attribute of an existing product. |

## GET /users
Returns a list of JSON user objects containing user names and corresponding profile pictures filtered to a defined filter of either name or tags of the user.

### Endpoint URL
> http://api.release-notes.com/users?method=methodType&search=searchTerm

### Query Parameters
| Name | Type | Description |
| -------- | -------- | -------- |
| `method`: Required | String | Defines how to filter the results. Can be `name` or `tags`. Using `name` the server will search for users that contain the search term in their `name` attribute. Using `tags` the server will search for users that contain an exact match to the search term in its `tags` attribute. |
| `search`: Required | String | The search term that will be used to filter users. |

### Example code
```
(async () => {
  try {
    const searchResults = await fetch("/users?method=name&search=")
    console.log(await searchResults.json())
  } catch (error) {
    console.log(error);
  }
})();
```
Above will return a list of all users
### Example Response
```
[
    {
        "name": "Company Name",
        "image": "company.png"
    }
    {
        "name": "Business Name",
        "image": "business.png"
    }
]
```
### Response Fields
| Name | Type | Description |
| -------- | -------- | -------- |
| `name` | String | The unique name of the user. |
| `image` | String | A reference to the image file stored in the servers `/files` folder. |

## GET /user
Returns a JSON object containing the details of a specific user.

### Endpoint URL
> http://api.release-notes.com/user?name=username

### Query Parameters
| Name | Type | Description |
| -------- | -------- | -------- |
| `name`: Required | String | The name of the user. Server will find a user with an exact match to the `name` attribute. |

### Example code
```
(async () => {
  try {
    const userDetails = await fetch("/user?name=username")
    console.log(await userDetails.json())
  } catch (error) {
    console.log(error);
  }
})();
```

### Example Response
```
{
    "name": "Username",
    "tags": ["User", "Tags"],
    "image": "userImage.png",
    "description": "This is a description of the user",
    "links": [{"text": "Displayed Text", "url": "http://link.url/"}],
}
```
### Response Fields
| Name | Type | Description |
| -------- | -------- | -------- |
| `name` | String | The unique name of the user. |
| `tags` | Array | The list of tags associated with the user. Each tag is stored a string. |
| `image` | String | A reference to the image file stored in the servers `/files` folder. |
| `description` | String | The description of the user. |
| `links` | Array | The list of links attached to the user. Links are stored as JSON objects containing a `text` attribute referring to the text that the link is displayed as, and a `url` attribute referring to the `href` of the link. |

## POST /new-user
Add a new user for the server to store. Data is posted as FormData.

### Endpoint URL
> http://api.release-notes.com/new-user

### Body Parameters
| Name | Type | Description |
| -------- | -------- | -------- |
| `name`: Required | String | The name of the user. |
| `password`: Required | String | The password of the user, used for logging in. |
| `tags`: Required | Array | A list of tags associated with the user. Tags must be in the form of a string, i.e. `"Tag"`. |
| `description`: Required | String | The description of the user. |
| `links`: Required | Array | A list of links attached to the user. Tags must be in a JSON object of the form `{"text": "Display Text", "url":"http://link.url/"}`. |
| `imageFile`: | File | The profile picture for the user. If no image file is found the server will default to `image` which will return a `404` when requested. |

### Example code
```
(async () => {
  try {
    const formData = new FormData()
    const imageFile = document.getElementById("imageInput").files[0]
    formData.append("imageFile", imageFile, imageFile.name)
    formData.append("name", name_)
    formData.append("password", password_)
    formData.append("tags", `[${tags_}]`)
    formData.append("description", description_)
    formData.append("links", `[${links_}]`)

    const postResponse = await fetch("/new-user", {
    method: "POST",
    body: formData
    })
    console.log(postResponse.status+": "+postResponse.statusText)
  } catch (error) {
    console.log(error);
  }
})();
```

### Example Response
```
201: Created
```
### Response Fields
| Name | Type | Description |
| -------- | -------- | -------- |
| `status` | Integer | The status code of the response. Basic codes are `201: Created` for user successfully registered and `409: Conflict` for when the user tries to register with the exact `name` attribute of an existing user. |

## GET /tags
Returns a list of Tags that are taken from all the existing tags on instances of either the `product` or `user` entity types.

### Endpoint URL
> http://api.release-notes.com/tags?type=entityType

### Query Parameters
| Name | Type | Description |
| -------- | -------- | -------- |
| `type`: Required | String | Defines where the list of tags should be read from. Can be either `products` or `users` and will default to `users` if any other value is given. Using `products` the server will build a list of tags from the tags that each product has. Using `users` the server will build a list of tags from the tags that each user has. |

### Example code
```
(async () => {
  try {
    const tagResults = await fetch("/tags?type=products")
    console.log(await tagResults.json())
  } catch (error) {
    console.log(error);
  }
})();
```
### Example Response
```
["Tag1", "Tag2", "Appliance", "Event"]
```
### Response Fields
| Name | Type | Description |
| -------- | -------- | -------- |
| `tags` | Array | A list of all tags belonging to an entity type. |

## GET /file
Returns a file from the `/files` directory in the server. Returns a `404` is the file does not exist.

### Endpoint URL
> http://api.release-notes.com/file?src=filename.png

### Query Parameters
| Name | Type | Description |
| -------- | -------- | -------- |
| `src`: Required | String | States the file name of the file that is being requested. |

### Example code
```
<img src="/file?src=imageFile.png" alt="An Image">
```
### Example Response
`imageFile.png`
### Response Fields
| Name | Type | Description |
| -------- | -------- | -------- |
| `file` | File | The requested file. |

## GET /login
Takes a Username and Password and checks wether they correspond to an existing user. If so they return a JSON object containing the user info. If the username does not exist it returns a `404: Not Found`. If the username and password do not match it returns a `401: Unauthorized`

### Endpoint URL
> http://api.release-notes.com/login?username=UserName&password=PassWord

### Query Parameters
| Name | Type | Description |
| -------- | -------- | -------- |
| `username`: Required | String | The attempted username to log in with. |
| `password`: Required | String | The attempted password to log in with. |

### Example code
```
(async () => {
  try {
    const loginRes = await fetch("/login?username=UserName&password=PassWord")
    if (loginRes.ok){
        console.log(await loginRes.json())
    } else if (loginRes.status === 404) {
        console.log("User Not Found")
    } else if (loginRes.status === 401) {
        console.log("Password Incorrect")
    }
  } catch (error) {
    console.log(error);
  }
})();
```
### Example Response
```
{
    "name": "Username",
    "password": "password",
    "image": "profilePicture.png",
    "tags": ["User", "Tags"],
    "description": "This is a description of the user.",
    "links":[{"text":"link Text","url":"http://link.url/"}]
}
```
### Response Fields
| Name | Type | Description |
| -------- | -------- | -------- |
| `name` | String | The unique name of the user. |
| `password` | String | The password of the user. |
| `tags` | Array | The list of tags associated with the user. Each tag is stored a string. |
| `image` | String | A reference to the image file stored in the servers `/files` folder. |
| `description` | String | The description of the user. |
| `links` | Array | The list of links attached to the user. Links are stored as JSON objects containing a `text` attribute referring to the text that the link is displayed as, and a `url` attribute referring to the `href` of the link. |