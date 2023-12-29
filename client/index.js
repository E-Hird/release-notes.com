var main = document.getElementById("results");
var side = document.getElementById("side-content");
var results = [];
var elements = [];

async function loadResults(search){
    main.innerHTML = `<div class="spinner-border" role="status" style="margin-left: 50%; margin-top: 20%;">`
    let res = await fetch(`http://127.0.0.1:8080/products?search=${search}`);
    console.log(res);
    if(res.ok){
        results = await res.json();
        let insert = `<div class="grid">\n`;
        for (let i of results){
            insert +=   `<div class="card product-card">
            <img src="${i.thumbnail}" class="card-img-top" alt="Missing Thumbnail: ${i.name}">
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
        elements = document.getElementsByClassName("product-card");
        console.log(elements);
        for (let i=0;i<elements.length;i++){
            elements[i].addEventListener('click', async function(event){
                event.preventDefault();
                loadPreview(results[i]);
            });
        }
    }
}

async function loadPreview(product){
    console.log("product clicked")
    let ownerIcon = "this is the owner icon"
    let insert = `<div class="preview">
    <h5 class="preview-label">Name</h5>
    <h4 class="preview-title">${product.name}</h4>
    <h5 class="preview-label">Image</h5>
    <img class="preview-image" src="${product.thumbnail}" alt="Missing Thumbnail: ${product.thumbnail}">
    <h5 class="preview-label">Creator</h5>
    <div class="preview-owner">
        <img src="${ownerIcon}" class="owner-icon" alt="Missing Icon: ${product.owner}">
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
}

const input = document.getElementById("searchbar");

input.addEventListener('submit', async function(event){
    event.preventDefault();
    try {
        let search = document.getElementById("search-input").value;
        loadResults(search);
    } catch(e) {
        alert(e);
    }
});

main.addEventListener('load', loadResults(""));



