var main = document.getElementById("results")
var side = document.getElementById("side-content")

async function loadResults(search){
    let res = await fetch(`http://127.0.0.1:8080/products?search=${search}`);
    console.log(res);
    if(res.ok){
        let results = await res.json();
        insert = `<div class="row-cols-4">\n`;
        for (let i of results){
            insert +=   `<div class="card product-card">
            <img src="${i.thumbnail}" class="card-img-top" alt="Missing Thumbnail: ${i.name}">
            <div class="card-body">
                <h5 class="card-title">${i.name}</h5>
            </div>
            </div>  
            `;
        }
        insert += "\n</div>";
        main.innerHTML = insert
    }
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