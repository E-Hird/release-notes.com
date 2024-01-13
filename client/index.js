var main = document.getElementById("results");
var tagSite = document.getElementById("tags")
var side = document.getElementById("side-content");
var results = [];
var products = [];
var tagButtons = [];

async function loadResults(search, type){
    main.innerHTML = `<div class="spinner-border" role="status" style="margin-left: 50%; margin-top: 20%;">`;
    var searchRes;
    switch(type){
        case "name":
            searchRes = await fetch(`http://127.0.0.1:8080/products?type=name&search=${search}`);
            break;
        case "tag":
            searchRes = await fetch(`http://127.0.0.1:8080/products?type=tags&search=${search}`);
            break;
        case "owner":
            searchRes = await fetch(`http://127.0.0.1:8080/products?type=owner&search=${search}`);
            break;
    }
    if(searchRes.ok){
        results = await searchRes.json();
        let insert = `<div class="grid">\n`;
        for (let i of results){
            insert +=   `<div class="card product-card">
            <img src="/file?src=${i.thumbnail}" class="card-img-top" alt="Missing Thumbnail: ${i.name}" onerror="this.onerror=null;this.src='missingImage.png'">
            <div class="card-body">
                <h5 class="card-title">${i.name}</h5>
            </div>
            </div>  
            `;
        }
        for (let i=0;i<4;i++){
            insert += `<div class="blank-result"></div>`;
        }
        insert += "\n</div>";
        main.innerHTML = insert;
        products = document.getElementsByClassName("product-card");
        for (let i=0;i<products.length;i++){
            products[i].addEventListener('click', async function(event){
                event.preventDefault();
                loadPreview(results[i]);
            });
        }
    }
}

async function getTags(){
    tagSite.innerHTML = `<div class="spinner-border" role="status" style="margin-left: 50%; margin-top: 20%;">`;
    let tagRes = await fetch(`http://127.0.0.1:8080/tags`);
    let tagList = await tagRes.json();
    let insert = "";
    console.log(tagRes)
    console.log(tagList)
    if (tagRes.ok){
        for (i of tagList){
            insert += `<button type="button" class="btn btn-outline-secondary tag-btn">${i}</button>`;
        }
    }
    tagSite.innerHTML = insert;

    tagButtons = document.getElementsByClassName("tag-btn");
    for (let i=0;i<tagButtons.length;i++){
        tagButtons[i].addEventListener('click', async function(event){
            event.preventDefault();
            try {
                let tag = tagButtons[i].innerHTML
                loadResults(tag, "tag");
            } catch(e) {
                alert(e)
            }
        });
    }
}

async function loadPreview(product){
    console.log("product clicked")
    let ownerIcon = "this is the owner icon"
    let insert = `<div class="preview">
    <h5 class="preview-label">Name</h5>
    <h4 class="preview-title">${product.name}</h4>
    <h5 class="preview-label">Image</h5>
    <div class="preview-image"> 
        <img class="object-fit-fill border rounded" src="/file?src=${product.thumbnail}" alt="Missing Thumbnail: ${product.name}" width="100%" onerror="this.onerror=null;this.src='missingImage.png'";>
    </div>
    <h5 class="preview-label">Creator</h5>
    <div class="preview-owner">
        <img src="${ownerIcon}" class="owner-icon border rounded-circle" alt="Missing Icon: ${product.owner}" onerror="this.onerror=null;this.src='defaultIcon.png'">
        <p class="owner-name">${product.owner}</p>
    </div>
    <h5 class="preview-label">Description</h5>
    <p class="preview-description">${product.description}</p>
    <h5 class="preview-label">Tags</h5>
    <div class="preview-tags">
    `;
    for (let i of product.tags){
        insert += `<button type="button" class="btn btn-outline-secondary tag-btn">${i}</button>`;
    }
    insert += `</div>
    <a type="button" class="see-more">See more...</button>
    </div>`;
    side.innerHTML = insert;

    tagButtons = document.getElementsByClassName("tag-btn");
    for (let i=0;i<tagButtons.length;i++){
        tagButtons[i].addEventListener('click', async function(event){
            event.preventDefault();
            try {
                let tag = tagButtons[i].innerHTML
                loadResults(tag, "tag");
            } catch(e) {
                alert(e)
            }
        });
    }
}

const input = document.getElementById("searchbar");

input.addEventListener('submit', async function(event){
    event.preventDefault();
    try {
        let search = document.getElementById("search-input").value;
        loadResults(search, "name");
    } catch(e) {
        alert(e);
    }
});

document.addEventListener('DOMContentLoaded', async function(event){
    console.log("main loaded")
    event.preventDefault();
    loadResults("", "name");
    getTags();
});



