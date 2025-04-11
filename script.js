let input = document.querySelector(".input");
let submit = document.querySelector(".submit");
let winsGrid = document.querySelector(".wins-grid");

let winsSpan = document.querySelector(".totalWins");
let todayWinsSpan = document.querySelector(".todaysWins");

let winsArr = [];

getDateFromLC();
getStatistics();

if (localStorage.getItem("wins")) {
  winsArr = JSON.parse(localStorage.getItem("wins"));
}

submit.addEventListener("click", (e) => {
  e.preventDefault();

  let inputValue = input.value.trim();
  if (inputValue !== "") {
    addWinsToArr(input.value);

    input.value = "";
  } else {
    Swal.fire({
      title: "Error!",
      text: "Please Fill The Input",
      icon: "error",
    });
  }
});

function addWinsToArr(winText) {
  const win = {
    id: Date.now(),
    title: winText,
    createdAt: new Date().toLocaleString(),
    edited: false,
    editDate: null,
  };

  winsArr.push(win);

  addWinsToPage(winsArr);
  setDataToLS();
  getStatistics();

  console.log(winsArr);
}

function addWinsToPage(arr) {
  winsGrid.innerHTML = "";

  winsArr.forEach((win) => {
    let winCard = document.createElement("div");
    winCard.className = "win-card";

    let winText = document.createElement("p");
    winText.textContent = win.title;

    let createdAt = document.createElement("time");
    createdAt.className = "created-at";
    createdAt.textContent = win.createdAt;

    let deleteBtn = document.createElement("button");
    deleteBtn.classList = "delete-btn";
    deleteBtn.innerHTML = `<i class="ri-delete-bin-5-fill"></i>`;

    let editBtn = document.createElement("button");
    editBtn.classList = "edit-btn";
    editBtn.innerHTML = `<i class="ri-edit-circle-fill"></i>`;

    winCard.append(winText, createdAt, deleteBtn, editBtn);

    winsGrid.appendChild(winCard);

    deleteBtn.addEventListener("click", (e) => {
      e.preventDefault();
      deleteWin(win.id);
    });

    editBtn.addEventListener("click", (e) => {
      e.preventDefault();
      editWin(win.id, win.title);
    });

    let editedTag = document.createElement("p");
    if (win.edited) {
      editedTag.className = "editTag";
      editedTag.textContent = "Edited";
      winCard.appendChild(editedTag);
      win.editDate = new Date().toLocaleString();
    }
    editedTag.setAttribute("title", win.editDate);
  });
}

async function editWin(winId, winText) {
  const { value: newValue } = await Swal.fire({
    title: "Edit You Win Text",
    input: "text",
    inputLabel: "Write Your New Text",
    inputPlaceholder: `Old Value: ${winText}`,
    icon: "info",
    showCancelButton: true,
    confirmButtonText: "Edit",
  });
  if (newValue) {
    const winToEdit = winsArr.find((win) => win.id === winId);
    if (winToEdit) {
      winToEdit.title = newValue;
      winToEdit.edited = true;

      addWinsToPage(winsArr);
      setDataToLS();

      Swal.fire({
        title: "Done!",
        text: `New Value: ${newValue}`,
        icon: "success",
      });
    }
  }
}

function deleteWin(winId) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      winsArr = winsArr.filter((win) => win.id !== winId);

      getStatistics();
      addWinsToPage(winsArr);
      setDataToLS();
      Swal.fire({
        title: "Deleted!",
        text: "Your file has been deleted.",
        icon: "success",
      });
    }
  });
}

function setDataToLS() {
  localStorage.setItem("wins", JSON.stringify(winsArr));
}

function getDateFromLC() {
  let data = localStorage.getItem("wins");
  if (data) {
    winsArr = JSON.parse(data);
    addWinsToPage(winsArr);
  }
}

function getStatistics() {
  function getTodayWins() {
    let today = new Date();
    today.setHours(0, 0, 0, 0);

    let todayWinsCount = 0;

    for (let i = 0; i < winsArr.length; i++) {
      let winDate = new Date(winsArr[i].createdAt);
      winDate.setHours(0, 0, 0, 0);

      if (winDate.getTime() === today.getTime()) {
        todayWinsCount++;
      }
    }

    return todayWinsCount;
  }

  if (winsArr.length > 0) {
    winsSpan.textContent = winsArr.length;
    todayWinsSpan.textContent = getTodayWins();
  }
}

let deleteAllBtn = document.querySelector(".delete-all");

function deleteAll() {
  if (winsArr.length === 0) {
    Swal.fire({
      title: "There's No Wins Yet!",
      icon: "error",
    });
  } else {
    winsArr.length = 0;
    localStorage.removeItem("wins");
    getStatistics();
    addWinsToPage(winsArr);
    setDataToLS();
    Swal.fire({
      title: "Deleted!",
      text: "Your file has been deleted.",
      icon: "success",
    });
  }
}

deleteAllBtn.addEventListener("click", deleteAll);
