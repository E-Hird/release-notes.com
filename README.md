# release-notes.com
A Webapp that compiles the Release Information for a wide range of products and services into one navigable site.

# API

# Products

## GET /products?method&search
Returns a list of products names and corresponding thumbnails filtered to a defined filter of either name, owner or tags of the product.

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