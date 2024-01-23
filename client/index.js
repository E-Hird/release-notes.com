const main = document.getElementById('results')
const tagSite = document.getElementById('tags')
const side = document.getElementById('preview-area')

let results = []
let products = []
let tagButtons = []


let newTags = []

const user = 0

async function loadResults(search, type, method, target=main){
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
          //alert(e)
          console.log(e.name + ": " + e.message)
        } 
      })
      products[i].addEventListener('dblclick', async function (event) {
        event.preventDefault()
        try{
          let type_ = type.slice(0, -1)
          loadResult(results[i].name, type_)
        } catch(e){
          //alert(e)
          console.log(e.name + ": " + e.message)
        } 
      })
    }
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
        let ownerData = await (await fetch(`/user?name=${item.owner}`)).json()
        let ownerIcon = ownerData.image
        insert += `
        <h5 class="label">Creator</h5>
        <div id="item-owner" class="user-profile">
            <img src="/file?src=${ownerIcon}" class="owner-icon border rounded-circle" alt="Missing Icon: ${item.owner}" onerror="this.onerror=null;this.src='defaultIcon.png'">
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
        insert += `<a class="link-secondary" href="${i.url}">${i.text}</a>`
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
      document.getElementById("item-owner").addEventListener((window.width > 768) ? "dblclick" : "click", async function(event) {
        event.preventDefault()
        try{
          loadResult(item.owner, "user")
        } catch(e) {
          //alert(e)
          console.log(e.name + ": " + e.message)
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
          //alert(e)
          console.log(e.name + ": " + e.message)
        }
      })
    }
  } else {
    alert(`Product not found`)
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
        let ownerData = await (await fetch(`/user?name=${item.owner}`)).json()
        let ownerIcon = ownerData.image
        insert += `<h5 class="label">Creator</h5>
        <div id="owner-profile" class="user-profile">
            <img src="/file?src=${ownerIcon}" class="owner-icon border rounded-circle" alt="Missing Icon: ${item.owner}" onerror="this.onerror=null;this.src='defaultIcon.png'">
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
          //alert(e)
          console.log(e.name + ": " + e.message)
        }
      })
    }
    if (type == "product"){
      document.getElementById("owner-profile").addEventListener((window.width > 768) ? "dblclick" : "click", async function(event) {
        event.preventDefault()
        try{
          loadResult(item.owner, "user")
        } catch(e) {
          //alert(e)
          console.log(e.name + ": " + e.message)
        }
      })
    }
    document.getElementById("see-more").addEventListener("click", async function(event) {
      event.preventDefault()
      try{
        loadResult(item.name, type)
      } catch(e) {
        //alert(e)
          console.log(e.name + ": " + e.message)
      }
    })
  } else {
    insert = `Item not found`
    side.innerHTML = insert
  }
}

async function getTags(type){
  tagSite.innerHTML = '<div class="spinner-border" role="status" style="margin-left: 50%;">'
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
        const tag = tagButtons[i].innerHTML
        loadResults(tag, type, 'tags')
        getTags(type)
      } catch (e) {
        //alert(e)
        console.log(e.name + ": " + e.message)
      }
    })
  }
}

async function displayProfile(){
  console.log("logged in")
  let userData = JSON.parse(sessionStorage.getItem("user"))
  document.getElementById("profile").innerHTML = `
  <a class="btn user-profile" id="profile-nav" type="button" data-bs-toggle="offcanvas" href="#profile-offcanvas">
  <img src="/file?src=${userData.image}" class="owner-icon border rounded-circle" alt="Missing Icon" onerror="this.onerror=null;this.src='defaultIcon.png'">
  <h5>${userData.name}</h5>
  </a>`
  document.getElementById("profile-title").innerHTML = "Profile"
  document.getElementById("profile-body").innerHTML = `
  <div id="profile-short">
  <img src="/file?src=${userData.image}" class="owner-icon border rounded" alt="Missing Icon" onerror="this.onerror=null;this.src='defaultIcon.png'" style="width:180px;height:180px;">
  <div id="profile-buttons">
  <h5>${userData.name}</h5>
  <button id="view-profile" class="btn btn-secondary" data-bs-dismiss="offcanvas">View Profile</button>
  <button id="logout-btn" class="btn btn-danger">Logout</button>
  </div>
  </div>`

  document.getElementById("view-profile").addEventListener("click", () => {
    loadResult(userData.name, "user")
  })
  document.getElementById("logout-btn").addEventListener("click", () => {
    sessionStorage.setItem("loggedIn", "false")
    sessionStorage.setItem("user", "")
    sessionStorage.setItem("page", "products")
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

async function postUser(){
  main.innerHTML = '<div class="spinner-border" role="status" style="margin-left: 50%; margin-top: 20%;">'
  let insert = `
  <h3>Sign Up</h3>
  <form id="new-user">
    <div>
      <label class="form-label" for="nameInput">Username</label>
      <input type="text" class="form-control" id="nameInput" placeholder="Username" maxlength="20" required>
      <div id="usernameHelp" class="form-text">
        Username must be <20 characters long.
      </div>
    </div>
    <div>
      <label class="form-label" for="passwordCreate">Password</label>
      <input type="password" class="form-control" id="passwordCreate" placeholder="Password" maxlength="20" minlength="8" required>
      <div id="passwordHelp" class="form-text">
        Password must be 8 - 20 characters long.
      </div>
    </div>
    <div>
      <label class="form-label" for="passwordConfirm">Confirm Password</label>
      <input type="password" class="form-control" id="passwordConfirm" placeholder="Re-type Password" maxlength="20" minlength="8" required>
    </div>
    <div>
      <label class="form-label" for="iconInput">Upload Profile Picture</label>
      <input type="file" class="form-control" id="iconInput" accept="image/jpeg, image/png, image/webp">
      <div id="profileIconHelp" class="form-text">
        JPEG, PNG and WEBP formats supported, Use a square aspect ratio for the best results.
      </div>
    </div>
    <div>
      <label class="form-label" for="descriptionInput">Short Description</label>
      <textarea type="text" class="form-control" id="descriptionInput" placeholder="Write a short description of yourself." maxlength="1000" spellcheck="true" rows="6"></textarea>
      <div id="usernameHelp" class="form-text">
        Description must be <1000 characters long.
      </div>
    </div>
    <div>
      <label class="form-label" for="tagInput">Tags</label>
      <input type="text" class="form-control" id="tagInput" minlength="1" maxlength="15">
      <div id="tagHelp" class="form-text">
        Tags must be 1 - 15 characters long, Type a tag and press enter. You can have at most 10 tags.
      </div>
      <label class="form-label">Current Tags</label>
      <div class="d-flex flex-row overflow-scroll" id="currentTags"></div>
      <div id="tagsHelp" class="form-text">
        Click on a tag to remove it.
      </div>
    </div>
    <div>
      <label class="form-label">Links</label>
      <div id="linksInput">
        <div class="input-group link-input">
          <input type="text" class="form-control" id="display-text" placeholder="Display text" minlength="1">
          <input type="url" class="form-control" id="link-url" placeholder="Link URL">
        </div>
      </div>
      <button class="btn btn-secondary" id="add-link-btn" type="button" style="margin-top:5px;">Add Link</button>
      <div id="linksHelp" class="form-text">
        Links with no Display text will be ignored
      </div>
    </div>
    <button type="submit" class="btn btn-primary">Sign Up</button>
    <div id="form-status"></div>
    </form>
    `
    main.innerHTML = insert
    tagSite.innerHTML = ""
    side.innerHTML = ""

    addFormFunctions()

    const form = document.getElementById("new-user")
    form.addEventListener("submit", async function (event){
      event.preventDefault()
      let name_ = document.getElementById("nameInput").value
      let password_ = document.getElementById("passwordCreate").value
      let confirm_ = document.getElementById("passwordConfirm").value
      let image_ = document.getElementById("iconInput").value
      let description_ = document.getElementById("descriptionInput").value
      let tags_ = []
      let links_ = []
      for (let i of document.getElementsByClassName("link-input")){
        let displayText = i.firstElementChild.value
        let linkURL = i.lastElementChild.value
        if (displayText !== "" && linkURL !== ""){
          links_.push(`{"text": "${displayText}", "url": "${linkURL}"}`)
        }
      }
      const status = document.getElementById("form-status")
      if (password_ === confirm_){
        let imageName = image_.slice(image_.lastIndexOf("\\")+1)
        console.log(imageName)

        for (let i=0;i<newTags.length;i++){
          tags_.push(`"${newTags[i]}"`)
        }

        const formData = new FormData()
        const imageFile = document.getElementById("iconInput").files[0]
        if (imageFile !== undefined)formData.append("imageFile", imageFile, imageFile.name)
        formData.append("name", name_)
        formData.append("password", password_)
        formData.append("tags", `[${tags_}]`)
        formData.append("description", description_)
        formData.append("links", `[${links_}]`)

        const res = await fetch("/new-user", {
          method: "POST",
          body: formData
        })
        if (res.ok){
          main.innerHTML = `<div class="alert alert-success">Account Created, Please sign in.</div>`
          newTags = []
        } else if(res.status === 409){
          status.innerHTML = "<div class='alert alert-danger'>Username is Taken.</div>"
        } else {
          status.innerHTML = `<div class="alert alert-danger">Error: ${res.status + res.statusText}</div>`
        }
      } else {
        status.innerHTML = "<div class='alert alert-danger'>Passwords do not match.</div>"
      }
    })
}
async function postProduct(){
  main.innerHTML = '<div class="spinner-border" role="status" style="margin-left: 50%; margin-top: 20%;">'
  if (sessionStorage.getItem("loggedIn") !== "true"){
    main.innerHTML = "<div class='alert alert-warning'>You must be signed in to create a product.</div>"
    tagSite.innerHTML = ""
    side.innerHTML = ""
    return
  }
  let insert = `
  <h3>Sign Up</h3>
  <form id="new-product">
    <div>
      <label class="form-label" for="nameInput">Product Name</label>
      <input type="text" class="form-control" id="nameInput" placeholder="Name" maxlength="100" required>
      <div id="productNameHelp" class="form-text">
        Product Name must be <100 characters long.
      </div>
    </div>
    <div>
      <label class="form-label" for="iconInput">Upload Product Thumbnail</label>
      <input type="file" class="form-control" id="iconInput" accept="image/jpeg, image/png, image/webp">
      <div id="productIconHelp" class="form-text">
        JPEG, PNG and WEBP formats supported, Use a square aspect ratio for the best results.
      </div>
    </div>
    <div>
      <label class="form-label" for="descriptionInput">Short Description</label>
      <textarea type="text" class="form-control" id="descriptionInput" placeholder="Write a short description of the product." maxlength="1000" spellcheck="true" rows="6"></textarea>
      <div id="usernameHelp" class="form-text">
        Description must be <1000 characters long.
      </div>
    </div>
    <div>
      <label class="form-label" for="tagInput">Tags</label>
      <input type="text" class="form-control" id="tagInput" minlength="1" maxlength="15">
      <div id="tagHelp" class="form-text">
        Tags must be 1 - 15 characters long, Type a tag and press enter. The product can have at most 10 tags.
      </div>
      <label class="form-label">Current Tags</label>
      <div class="d-flex flex-row overflow-scroll" id="currentTags"></div>
      <div id="tagsHelp" class="form-text">
        Click on a tag to remove it.
      </div>
    </div>
    <div>
      <label class="form-label">Links</label>
      <div id="linksInput">
        <div class="input-group link-input">
          <input type="text" class="form-control" id="display-text" placeholder="Display text" minlength="1">
          <input type="url" class="form-control" id="link-url" placeholder="Link URL">
        </div>
      </div>
      <button class="btn btn-secondary" id="add-link-btn" type="button" style="margin-top:5px;">Add Link</button>
      <div id="linksHelp" class="form-text">
        Links with no Display text will be ignored
      </div>
    </div>
    <button type="submit" class="btn btn-primary">Create Product</button>
    <div id="form-status"></div>
    </form>
    `
    main.innerHTML = insert
    tagSite.innerHTML = ""
    side.innerHTML = ""

    addFormFunctions()

    const form = document.getElementById("new-product")
    form.addEventListener("submit", async function (event){
      event.preventDefault()
      let name_ = document.getElementById("nameInput").value
      let image_ = document.getElementById("iconInput").value
      let description_ = document.getElementById("descriptionInput").value
      let owner_ = JSON.parse(sessionStorage.getItem("user")).name
      console.log(owner_)
      let tags_ = []
      let links_ = []
      for (let i of document.getElementsByClassName("link-input")){
        let displayText = i.firstElementChild.value
        let linkURL = i.lastElementChild.value
        if (displayText !== "" && linkURL !== ""){
          links_.push(`{"text": "${displayText}", "url": "${linkURL}"}`)
        }
      }
      const status = document.getElementById("form-status")
      
      let imageName = image_.slice(image_.lastIndexOf("\\")+1)
      console.log(imageName)

      for (let i=0;i<newTags.length;i++){
        tags_.push(`"${newTags[i]}"`)
      }

      const formData = new FormData()
      const imageFile = document.getElementById("iconInput").files[0]
      if (imageFile !== undefined)formData.append("imageFile", imageFile, imageFile.name)
      formData.append("name", name_)
      formData.append("tags", `[${tags_}]`)
      formData.append("description", description_)
      formData.append("links", `[${links_}]`)
      formData.append("owner", owner_)
      formData.append("extras", "[]")

      const res = await fetch("/new-product", {
        method: "POST",
        body: formData
      })
      if (res.ok){
        main.innerHTML = `<div class="alert alert-success">Product Created.</div>`
        newTags = []
      } else if(res.status === 409){
        status.innerHTML = "<div class='alert alert-danger'>Product Name is Taken.</div>"
      } else {
        status.innerHTML = `<div class="alert alert-danger">Error: ${res.status + res.statusText}</div>`
      }
    })
}

function addFormFunctions(){
  let tagInput = document.getElementById("tagInput")
  tagInput.addEventListener("keydown", function(event) {
    if (event.key === 'Enter'){
      event.preventDefault()
      if (!newTags.includes(tagInput.value) && newTags.length < 10){
        const tag = document.createElement('button')
        tag.innerHTML = tagInput.value
        tag.setAttribute("class", "btn btn-info")
        newTags.push(tagInput.value)
        tag.setAttribute("onclick", `
        event.preventDefault()
        removeTag(this)
        `)
        tag.setAttribute("style", "margin-right: 5px;")
        document.getElementById("currentTags").appendChild(tag)

        tagInput.value = ""
      }
    }
  })
  document.getElementById("add-link-btn").addEventListener("click", function(event) {
    event.preventDefault()
    const input = document.createElement('div')
    input.innerHTML = `
    <input type="text" class="form-control" placeholder="Display text" minlength="1">
    <input type="url" class="form-control" placeholder="Link URL">`
    input.setAttribute("class", "input-group link-input")
    document.getElementById("linksInput").appendChild(input)
  })
}
function removeTag(tag){
  newTags = newTags.filter(function (element) {
    return element !== tag.innerHTML
  })
  document.getElementById("currentTags").removeChild(tag)
}


document.getElementById('searchbar').addEventListener('submit', async function (event) {
  event.preventDefault()
  try {
    let type_ = (sessionStorage.getItem("page") == "users") ? "users" : "products"
    let search = document.getElementById('search-input').value
    loadResults(search, type_, 'name')
    getTags(type_)
  } catch (e) {
    //alert(e)
    console.log(e.name + ": " + e.message)
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
document.getElementById('signup-btn').addEventListener("click", async function(event) {
  event.preventDefault()
  postUser()
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
document.getElementById('new-nav').addEventListener("click", async function(event) {
  event.preventDefault()
  postProduct()
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
// 666 OH GOD