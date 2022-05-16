const API = "http://localhost:8000/drinks";

let inpName = document.getElementById("inpName");
let inpDesc = document.getElementById("inpDesc");
let inpImage = document.getElementById("inpImage");
let inpPrice = document.getElementById("inpPrice");
let btnAdd = document.getElementById("btnAdd");
let sectionDrinks = document.getElementById("sectionDrinks");
let btnOpenForm = document.getElementById("flush-collapseOne");

let searchValue = "1";

let currentPage = 1;
let countPage = 1;

btnAdd.addEventListener("click", () => {
  if (
    !inpName.value.trim() ||
    !inpDesc.value.trim() ||
    !inpImage.value.trim() ||
    !inpPrice.value.trim()
  ) {
    alert("Заполните поле!");
    return;
  }
  let newDrink = {
    drinkName: inpName.value,
    drinkDesc: inpDesc.value,
    drinkImage: inpImage.value,
    drinkPrice: inpPrice.value,
  };
  creatDrinks(newDrink);
  readDrinks();
});
// ! ---------------------- CREATE ---------------------------
function creatDrinks(drink) {
  fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(drink),
  }).then(() => readDrinks());
  inpName.value = "";
  inpImage.value = "";
  inpDesc.value = "";
  inpPrice.value = "";
  btnOpenForm.classList.toggle("show");
}

// ! ------------------------- READ ----------------------------
function readDrinks() {
  fetch(`${API}?q=${searchValue}&_page=${currentPage}&_limit=5`)
    .then((res) => res.json())
    .then((data) => {
      sectionDrinks.innerHTML = "";
      data.forEach((item) => {
        sectionDrinks.innerHTML += `
        <div class="card mt-3" style="width: 15rem;">
  <img src="${item.drinkImage}" class="card-img-top" style="height:280px" alt="${item.bookName}">
  <div class="card-body">
    <h5 class="card-title">${item.drinkName}</h5>
    <p class="card-text">${item.drinkDesc}</p>
    <p class="card-text">${item.drinkPrice}</p>
    <button class="btn btn-outline-danger btnDelete" id="${item.id}">Удалить</button>
    <button class="btn btn-outline-warning btnEdit" id="${item.id}" data-bs-toggle="modal"
    data-bs-target="#exampleModal">Изменить</button>
  </div>
</div>
        `;
      });
      sumPage();
    });
}
readDrinks();
// !---------------------- DELETE ------------------------
document.addEventListener("click", (event) => {
  let del_class = [...event.target.classList];
  if (del_class.includes("btnDelete")) {
    let del_id = event.target.id;
    fetch(`${API}/${del_id}`, {
      method: "DELETE",
    }).then(() => readDrinks());
  }
});
// ! DELETE FINISH
// !------------------ EDIT START ----------------------
let editInpName = document.getElementById("editInpName");
let editInpDesc = document.getElementById("editInpDesc");
let editInpImage = document.getElementById("editInpImage");
let editInpPrice = document.getElementById("editInpPrice");
let editBtnSave = document.getElementById("editBtnSave");

document.addEventListener("click", (event) => {
  let editArr = [...event.target.classList];
  if (editArr.includes("btnEdit")) {
    let id = event.target.id;
    fetch(`${API}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        editInpName.value = data.drinkName;
        editInpDesc.value = data.drinkDesc;
        editInpImage.value = data.drinkImage;
        editInpPrice.value = data.drinkPrice;
        editBtnSave.setAttribute("id", data.id);
      });
  }
});

// !------------------ EDIT FINISH ----------------------

editBtnSave.addEventListener("click", () => {
  let editedDrink = {
    drinkName: editInpName.value,
    drinkDesc: editInpAuthor.value,
    drinkImage: editInpImage.value,
    drinkPrice: editInpPrice.value,
  };
  editDrink(editedDrink, editBtnSave.id);
});

function editBook(objEditBook, id) {
  fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(objEditBook),
  }).then(() => readDrinks());
}

// ! ------------------ SEARCH ---------------------------
let inpSearch = document.getElementById("inpSearch");

inpSearch.addEventListener("input", (event) => {
  searchValue = event.target.value;
  readDrinks();
});

// !-------------------------- PAGINATION --------------------------
let prevBtn = document.getElementById("prevBtn");
let nextBtn = document.getElementById("nextBtn");

prevBtn.addEventListener("click", () => {
  if (currentPage <= 1) return;
  currentPage--;
  readDrinks();
});

nextBtn.addEventListener("click", () => {
  if (currentPage >= countPage) return;
  currentPage++;
  readDrinks();
});

function sumPage() {
  fetch(API)
    .then((res) => res.json())
    .then((data) => {
      countPage = Math.ceil(data.length / 6);
    });
}
