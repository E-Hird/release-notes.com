const express = require("express");
const app = express();

var products = require("./products.json")

function check_product(product, term){
    if (product.name.toLowerCase().includes(term)){
        return true;
    }
    if (product.owner.toLowerCase().includes(term)){
        return true;
    }
    return false;
}

app.use(express.static('client'));

app.get("/products", (req, res) => {
    let search = req.query.search;
    let results = [];
    for (let i of products){
        if(check_product(i, search)){
            results.push(i);
        }
    }
    console.log(results)
    res.send(results);
});

app.listen(8080);