const main = document.getElementById('results')
const tagSite = document.getElementById('tags')
const side = document.getElementById('preview-area')

let results = []
let products = []
let tagButtons = []

const user = 0

async function loadResults (search, type, method, target=main) {
  sessionStorage.setItem("page", (target == main) ? type:user )
  target.innerHTML = '<div class="spinner-border" role="status" style="margin-left: 50%; margin-top: 20%;">'
  let searchRes = await fetch(`http://127.0.0.1:8080/${type}?method=${method}&search=${search}`)
  if (searchRes.ok) {
    results = await searchRes.json()
    let insert = '<div class="grid">\n'
    let defaultImage = (type=='products') ? "missingImage.png" : "defaultIcon.png"
    for (let i of results) {
      insert += `<div class="card product-card">
            <img src="/file?src=${i.image}" class="card-img-top" alt="Missing Thumbnail: ${i.name}" onerror="this.onerror=null;this.src='${defaultImage}'">
            <div class="card-body">
                <h5 class="card-title">${i.name}</h5>
            </div>
            </div>  
            `
    }
    for (let i = 0; i < 4; i++) {
      insert += '<div class="blank-result"></div>'
    }
    insert += '\n</div>'
    target.innerHTML = insert
    products = document.getElementsByClassName('product-card')
    for (let i = 0; i < products.length; i++) {
      products[i].addEventListener('click', async function (event) {
        event.preventDefault()
        try{
          let type_ = type.slice(0, -1)
          if (window.innerWidth < 768){
            loadResult(results[i].name, type_)
          } else {
            loadPreview(results[i].name, type_)
          }
        } catch(e){
          alert(e)
        } 
      })
      products[i].addEventListener('dblclick', async function (event) {
        event.preventDefault()
        try{
          let type_ = type.slice(0, -1)
          loadResult(results[i].name, type_)
        } catch(e){
          alert(e)
        } 
      })
    }
  }
}

async function getTags (type) {
  tagSite.innerHTML = '<div class="spinner-border" role="status" style="margin-left: 50%; margin-top: 20%;">'
  let tagRes = await fetch(`/tags?type=${type}`)
  let tagList = await tagRes.json()
  let insert = ''
  if (tagRes.ok) {
    for (let i of tagList) {
      insert += `<button type="button" class="btn btn-outline-secondary tag-btn">${i}</button>`
    }
  }
  tagSite.innerHTML = insert

  tagButtons = document.getElementsByClassName('tag-btn')
  for (let i = 0; i < tagButtons.length; i++) {
    tagButtons[i].addEventListener('click', async function (event) {
      event.preventDefault()
      try {
        let tag = tagButtons[i].innerHTML
        loadResults(tag, type, 'tags')
      } catch (e) {
        alert(e)
      }
    })
  }
}

async function loadPreview(itemname, type) {
  side.innerHTML = '<div class="spinner-border" role="status" style="margin-left: 35%; margin-top: 50%;">'
  const itemRes = await fetch(`/${type}?name=${itemname}`)
  if (itemRes.ok){
    let item = await itemRes.json()
    let insert = `<div id="preview">
      <h5 class="label">Name</h5>
      <h4 id="preview-title">${item.name}</h4>
      <h5 class="label">Image</h5>
      <div id="preview-image"> 
          <img class="object-fit-fill border rounded" src="/file?src=${item.image}" alt="Missing Thumbnail: ${item.name}" width="100%" onerror="this.onerror=null;this.src='missingImage.png'";>
      </div>`
      if (type == "product"){
        let ownerData = await fetch(`/user?name=${item.owner}`)
        let ownerIcon = ownerData.image
        insert += `<h5 class="label">Creator</h5>
        <div class="owner-profile">
            <img src="${ownerIcon}" class="owner-icon border rounded-circle" alt="Missing Icon: ${item.owner}" onerror="this.onerror=null;this.src='defaultIcon.png'">
            <h5 id="owner-name">${item.owner}</h5>
        </div>`
      }
      insert += `<h5 class="label">Description</h5>
      <p id="preview-description">${item.description}</p>
      <h5 class="label">Tags</h5>
      <div id="preview-tags">
      `
    for (let i of item.tags) {
      insert += `<button type="button" class="btn btn-outline-secondary tag-btn">${i}</button>`
    }
    insert += `</div>
      <a type="button" id="see-more">See more...</button>
      </div>`
    side.innerHTML = insert

    tagButtons = document.getElementsByClassName('tag-btn')
    for (let i = 0; i < tagButtons.length; i++) {
      tagButtons[i].addEventListener('click', async function (event) {
        event.preventDefault()
        try {
          const tag = tagButtons[i].innerHTML
          loadResults(tag, `${type}s`, 'tags')
          getTags(`${type}s`)
        } catch (e) {
          alert(e)
        }
      })
    }
    document.getElementById("see-more").addEventListener("click", async function(event) {
      event.preventDefault()
      try{
        loadResult(item.name, type)
      } catch(e) {
        alert(e)
      }
    })
  } else {
    insert = `Item not found`
    side.innerHTML = insert
  }
}

async function loadResult(name, type){
  main.innerHTML = '<div class="spinner-border" role="status" style="margin-left: 50%; margin-top: 20%;">'
  const itemRes = await fetch(`/${type}?name=${name}`)
  if (itemRes.ok){
    let item = await itemRes.json()
    let insert = `<div id="item-page">
      <div id="item-display">
        <h5 class="label">Name</h5>
        <h4 class="item-title">${item.name}</h4>
        <h5 class="label">Image</h5>
        <div class="item-image"> 
            <img class="object-fit-fill border rounded" src="/file?src=${item.image}" alt="Missing Thumbnail: ${item.name}" width="100%" onerror="this.onerror=null;this.src='missingImage.png'";>
        </div>
      </div>
      <div id="item-details">`
      if (type == 'product'){
        let ownerData = await fetch(`/user?name=${item.owner}`)
        let ownerIcon = ownerData.image
        insert += `
        <h5 class="label">Creator</h5>
        <div id="item-owner">
            <img src="${ownerIcon}" class="owner-icon border rounded-circle" alt="Missing Icon: ${item.owner}" onerror="this.onerror=null;this.src='defaultIcon.png'">
            <h5 id="owner-name">${item.owner}</h5>
        </div>`
      }
      insert += `  
      <h5 class="label">Description</h5>
      <p id="item-description">${item.description}</p>
      <h5 class="label">Links</h5>
      <div id="item-links">
      `
      for (let i of item.links) {
        insert += `<a class="link-secondary" href="${i.href}">${i.text}</a>`
      }
      insert += `</div>
      <h5 class="label">Tags</h5>
      <div id="item-tags">
      `
    for (let i of item.tags) {
      insert += `<button type="button" class="btn btn-outline-secondary tag-btn">${i}</button>`
    }
    insert += `</div></div>`
    if (type == "product"){
      insert += `<div id="item-extras">`
      for (let i of item.extras) {
        insert += `extra, file reference ${i}`
      }
      insert += "</div>"
      main.innerHTML = insert
      document.getElementById("item-owner").addEventListener("click", async function(event) {
        event.preventDefault()
        try{
          loadResult(item.owner, "user")
        } catch(e) {
          alert(e)
        }
      })
    } else if (type == "user"){
      insert += `<h5 class="label" style="margin-left: 3vw !important; margin-top: 3vw; font-size:x-large">Products</h5>
      <div id="owner-products"></div>`
      main.innerHTML = insert
      console.log(item.name)
      loadResults(item.name, "products", "owner", document.getElementById("owner-products"))
    }
    side.innerHTML = ""
    tagSite.innerHTML = ""

    sessionStorage.setItem("page", type)
    sessionStorage.setItem("item", item.name)

    tagButtons = document.getElementsByClassName('tag-btn')
    for (let i = 0; i < tagButtons.length; i++) {
      tagButtons[i].addEventListener('click', async function (event) {
        event.preventDefault()
        try {
          const tag = tagButtons[i].innerHTML
          loadResults(tag, `${type}s`, 'tags')
          getTags(`${type}s`)
        } catch (e) {
          alert(e)
        }
      })
    }
  } else {
    alert(`Product not found`)
  }
}

async function displayProfile(){
  console.log("logged in")
  let userData = JSON.parse(sessionStorage.getItem("user"))
  document.getElementById("profile").innerHTML = `
  <a class="btn" id="profile-nav" type="button" data-bs-toggle="offcanvas" href="#profile-offcanvas">
  <img src="/file?src=${userData.image}" class="owner-icon border rounded-circle" alt="Missing Icon" onerror="this.onerror=null;this.src='defaultIcon.png'">
  <h5>${userData.name}</h5>
  </a>`
  document.getElementById("profile-title").innerHTML = "Profile"
  document.getElementById("profile-body").innerHTML = `
  <div id="profile-short">
  <img src="/file?src=${userData.image}" class="owner-icon border rounded" alt="Missing Icon" onerror="this.onerror=null;this.src='defaultIcon.png'" style="width:180px;height:180px;">
  <div id="profile-buttons">
  <h5>${userData.name}</h5>
  <button id="view-profile" class="btn btn-secondary">View Profile</button>
  <button id="edit-profile" class="btn btn-secondary">Edit Profile</button>
  <button id="logout-btn" class="btn btn-danger">Logout</button>
  </div>
  </div>`

  document.getElementById("logout-btn").addEventListener("click", () => {
    sessionStorage.setItem("loggedIn", "false")
    sessionStorage.setItem("user", "")
    location.reload()
  })
}

async function loadPage(page){
  switch (page){
    case "user":
      //Rollover to do the same as product
    case "product":
      loadResult(sessionStorage.getItem("item"), page)
      break;
    case "users":
      loadResults("", "users", "name")
      getTags("users")
      break;
    case 'products':
      // Roll over into default (products is default page)
    default:
      loadResults("", "products", "name")
      getTags("products")
      break
  }
}



document.getElementById('searchbar').addEventListener('submit', async function (event) {
  event.preventDefault()
  try {
    let type_ = (sessionStorage.getItem("page") == "users") ? "users" : "products"
    let search = document.getElementById('search-input').value
    loadResults(search, type_, 'name')
    getTags(type_)
  } catch (e) {
    alert(e)
  }
})

document.getElementById('login-form').addEventListener("submit", async function (event) {
  event.preventDefault()
  let name = document.getElementById("userInput").value
  let password = document.getElementById("passwordInput").value
  let response = await fetch(`/login?username=${name}&password=${password}`)
  if (response.ok & response.status != 404){
    let userData = await response.json()
    sessionStorage.setItem("loggedIn", "true")
    sessionStorage.setItem("user", JSON.stringify(userData))
    displayProfile()
  } else if (response.status == 401){
    console.log("incorrect password")
    document.getElementById("login-status").innerHTML = `
    <div class="alert alert-danger" role="alert">
      Login Unsuccessful: Incorrect Password
    </div>`
  } else if (response.status == 404){
    console.log("not a user")
    document.getElementById("login-status").innerHTML = `
    <div class="alert alert-danger" role="alert">
      Login Unsuccessful: User not found
    </div>`
  } else {
    document.getElementById("login-status").innerHTML = `
    <div class="alert alert-danger" role="alert">
      HTTP Error: ${response.status}
    </div>`
  }
})

document.getElementById('home-nav').addEventListener("click", async function(event) {
  event.preventDefault()
  loadResults("", "products", "name")
  getTags('products')
})
document.getElementById('products-nav').addEventListener("click", async function(event) {
  event.preventDefault()
  loadResults("", "products", "name")
  getTags('products')
})
document.getElementById('users-nav').addEventListener("click", async function(event) {
  event.preventDefault()
  loadResults("", "users", "name")
  getTags('users')
})

document.addEventListener('DOMContentLoaded', async function (event) {
  console.log('main loaded')
  event.preventDefault()
  let logged = sessionStorage.getItem("loggedIn")
  if (logged == "true"){
    displayProfile()
  }
  let page_ = sessionStorage.getItem("page")
  loadPage(page_)
})
