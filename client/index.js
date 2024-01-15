const main = document.getElementById('results')
const tagSite = document.getElementById('tags')
const side = document.getElementById('preview-area')

let results = []
let products = []
let tagButtons = []

const user = 0

async function loadResults (search, type) {
  main.innerHTML = '<div class="spinner-border" role="status" style="margin-left: 50%; margin-top: 20%;">'
  let searchRes
  switch (type) {
    case 'name':
      searchRes = await fetch(`http://127.0.0.1:8080/products?type=name&search=${search}`)
      break
    case 'tag':
      searchRes = await fetch(`http://127.0.0.1:8080/products?type=tags&search=${search}`)
      break
    case 'owner':
      searchRes = await fetch(`http://127.0.0.1:8080/products?type=owner&search=${search}`)
      break
  }
  if (searchRes.ok) {
    results = await searchRes.json()
    let insert = '<div class="grid">\n'
    for (let i of results) {
      insert += `<div class="card product-card">
            <img src="/file?src=${i.thumbnail}" class="card-img-top" alt="Missing Thumbnail: ${i.name}" onerror="this.onerror=null;this.src='missingImage.png'">
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
    main.innerHTML = insert
    products = document.getElementsByClassName('product-card')
    for (let i = 0; i < products.length; i++) {
      products[i].addEventListener('click', async function (event) {
        event.preventDefault()
        loadPreview(results[i])
      })
    }
  }
}

async function getTags () {
  tagSite.innerHTML = '<div class="spinner-border" role="status" style="margin-left: 50%; margin-top: 20%;">'
  let tagRes = await fetch('http://127.0.0.1:8080/tags')
  let tagList = await tagRes.json()
  let insert = ''
  console.log(tagRes)
  console.log(tagList)
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
        loadResults(tag, 'tag')
      } catch (e) {
        alert(e)
      }
    })
  }
}

async function loadPreview (product) {
  console.log('product clicked')
  let ownerIcon = 'this is the owner icon'
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
        <h5 class="owner-name">${product.owner}</h5>
    </div>
    <h5 class="preview-label">Description</h5>
    <p class="preview-description">${product.description}</p>
    <h5 class="preview-label">Tags</h5>
    <div class="preview-tags">
    `
  for (let i of product.tags) {
    insert += `<button type="button" class="btn btn-outline-secondary tag-btn">${i}</button>`
  }
  insert += `</div>
    <a type="button" class="see-more">See more...</button>
    </div>`
  side.innerHTML = insert

  tagButtons = document.getElementsByClassName('tag-btn')
  for (let i = 0; i < tagButtons.length; i++) {
    tagButtons[i].addEventListener('click', async function (event) {
      event.preventDefault()
      try {
        const tag = tagButtons[i].innerHTML
        loadResults(tag, 'tag')
      } catch (e) {
        alert(e)
      }
    })
  }
}

async function displayProfile(){
    console.log("logged in")
    let userData = JSON.parse(sessionStorage.getItem("user"))
    document.getElementById("profile").innerHTML = `
    <a class="btn" id="profile-nav" type="button" data-bs-toggle="offcanvas" href="#profile-offcanvas">
    <img src="/file?src=${userData.profile_picture}" class="owner-icon border rounded-circle" alt="Missing Icon" onerror="this.onerror=null;this.src='defaultIcon.png'">
    <h5>${userData.username}</h5>
    </a>`
    document.getElementById("profile-title").innerHTML = "Profile"
    document.getElementById("profile-body").innerHTML = `
    <div id="profile-short">
    <img src="/file?src=${userData.profile_picture}" class="owner-icon border rounded" alt="Missing Icon" onerror="this.onerror=null;this.src='defaultIcon.png'" style="width:180px;height:180px;">
    <div id="profile-buttons">
    <h5>${userData.username}</h5>
    <button class="btn btn-secondary">View Profile</button>
    <button class="btn btn-secondary">Edit Profile</button>
    <button class="btn btn-danger">Logout</button>
    </div>
    </div>`
}

const input = document.getElementById('searchbar')

const login = document.getElementById('login-form')

input.addEventListener('submit', async function (event) {
  event.preventDefault()
  try {
    let search = document.getElementById('search-input').value
    loadResults(search, 'name')
  } catch (e) {
    alert(e)
  }
})

login.addEventListener("submit", async function (event) {
  event.preventDefault()
  let username = document.getElementById("userInput").value
  let password = document.getElementById("passwordInput").value
  let response = await fetch(`/login?username=${username}&password=${password}`)
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

document.addEventListener('DOMContentLoaded', async function (event) {
  console.log('main loaded')
  event.preventDefault()
  let logged = sessionStorage.getItem("loggedIn")
  if (logged == "true"){
    displayProfile()
  }
  loadResults('', 'name')
  getTags()
})
