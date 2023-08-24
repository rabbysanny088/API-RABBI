const bigRst = document.getElementById("tbody");
const filterInput = document.getElementById("searchInput");
const createBtn = document.getElementById("create");
const submitBtn = document.getElementById("submit");
const copiedDataDiv = document.querySelector('#copiedData');
const loadingOverlay = document.getElementById("loadingOverlay");


let itmes = [];

async function apiData() {

  try {
    loadingOverlay.style.display = "block";

    const respones = await fetch("https://jsonplaceholder.typicode.com/posts");

    itmes = await respones.json();
    apiCall(itmes);
  } catch (error) {

    netErrorAlert( "netWork Problem" + error.message);


  } finally {
    loadingOverlay.style.display = "none"; 
  }
}

function showErrorAlert(errorMsg){
  const alert = document.createElement("div");
  alert.classList.add("alert", "alert-danger");
  alert.textContent = errorMsg;
  alertModal.appendChild(alert);
}

function netErrorAlert(errorMsg){
  const alert = document.createElement("div");
  alert.classList.add("alert", "alert-danger");
  alert.textContent = errorMsg;
  netError.appendChild(alert);
}



function apiCall(param) {
  const st = param
    .map((item) => {
      return `
      <tr>
      <td>${item.userId}</td> 
      <td>${item.id}</td>
      <td>${item.title}</td>
      <td>${item.body}</td>
      <td><button onclick="copyButton(this)"> <i class="ri-file-copy-line"></i> </button></td>
      <td><button class="btn-box"  data-bs-toggle="modal" data-bs-target="#exampleModal "onclick="onEdit(this)"><i class="ri-edit-2-line"></i>Edit</button></td><td> 
      <button class="btn-box" id="deleteLoading" onclick="deleteData(${item.id})"><i class="ri-delete-bin-6-line"></i>Delete</button></td>
      </tr>
      `;
    })
    .join("");

  bigRst.innerHTML = st;
}

filterInput.addEventListener("keyup", (x) => {
  let text = x.target.value.toLowerCase();
  document.querySelector("#tbody").querySelectorAll("tr")
    .forEach((best) => {
      let goes = best.querySelectorAll("td")[2].innerText;
      console.log(goes)
      if (goes.toLowerCase().indexOf(text) != -1) {
        best.style.display = "block";
      } else {
        best.style.display = "none";
      }
    });
});



function onEdit(td) {
  submitBtn.innerText = "Update";
  selecteRow = td.parentElement.parentElement;
  document.getElementById("userId").value = selecteRow.cells[0].innerHTML;
  document.getElementById("id").value = selecteRow.cells[1].innerHTML;
  document.getElementById("title").value = selecteRow.cells[2].innerHTML;
  document.getElementById("body").value = selecteRow.cells[3].innerHTML;
}

createBtn.addEventListener("click", () => {
  submitBtn.innerText = "Create";

  document.getElementById("userId").value = "";
  document.getElementById("id").value = "";
  document.getElementById("title").value = "";
  document.getElementById("body").value = "";
});


  function startLoading() {
    submitBtn.disabled = true;
    submitBtn.classList.add("loading");
  }

  function stopLoading() {
    submitBtn.innerText = "Create";
    submitBtn.disabled = false;
    submitBtn.classList.remove("loading");
  }

async function addData() {
  startLoading();

  // submitBtn.innerText = "loading...";
  // submitBtn.disabled = true;

  const userIdInput = document.getElementById("userId");
  const idInput = document.getElementById("id");
  const titleInput = document.getElementById("title");
  const bodyInput = document.getElementById("body");

  let payload = {
    userId: userIdInput.value,
    id: idInput.value,
    title: titleInput.value,
    body: bodyInput.value,
  };

  try {
    const apiFetch = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const data = await apiFetch.json();

    stopLoading();

    // submitBtn.innerText = "Create";
    // submitBtn.disabled = false;

    if (apiFetch.ok) {
      itmes.push(payload);
      console.log(itmes);
    }

    apiCall(itmes);
    console.log(apiFetch);

    // const modalElement = document.getElementById("exampleModal");
    // const backDrop = document.querySelector('.modal-backdrop');
    // backDrop.style.display = 'none';
    // modalElement.classList.remove("show");
    // modalElement.style.display = "none";

  } catch (error) {
      showErrorAlert( "netWork Problem" + error.message);
     setTimeout(() => {
      submitBtn.innerText = "Create";
      submitBtn.disabled = false;
      submitBtn.classList.remove("loading");
     }, 1000);
  }
  
}

function respectPeople() {
  // submitBtn.innerText = 'Loading...'
  // submitBtn.disabled = true;
  submitBtn.classList.add("Good");
}

function linkLoading() {
  submitBtn.innerText = "Updata";
  // submitBtn.disabled = false;
  submitBtn.classList.remove("Good");
}

async function editData() {
  respectPeople();


  
  const userIdInput = document.getElementById("userId");
  const idInput = document.getElementById("id");
  const titleInput = document.getElementById("title");
  const bodyInput = document.getElementById("body");
  
  let payload = {
    id: parseInt(idInput.value),
    userId: parseInt(userIdInput.value),
    title: titleInput.value,
    body: bodyInput.value,
  };
  
  // console.log(payload)
  
  try {

    
    const play = await fetch(`https://jsonplaceholder.typicode.com/posts/${payload.id}`,{
      method: "PUT",
      body: JSON.stringify(payload),
    });

    console.log(play);
    
    const dataPlay = await play.json();

    console.log(dataPlay);
    if (play.ok) {
      const editItems = itmes.map((boxs) => {
        if (boxs.id === payload.id) {
          return {
            ...boxs,
            userId: payload.userId,
            title: payload.title,
            body: payload.body,
          };
        } else {
          return boxs;
        }
      });

      console.log(editItems);
      itmes = editItems;
      apiCall(editItems);
    }
  } catch (error) {
    setTimeout(() => {
      showErrorAlert( "netWork Problem" + error.message);
    }, 3000);
  }finally{
    linkLoading();
  }
}

async function deleteData(id) {
  const protect = document.querySelector('#deleteLoading');

  protect.innerText = "Loading...";
  protect.disabled = true;


  const deleteapi = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${id}`,
    {
      method: "DELETE",
    }
  );

  try {
    if (deleteapi.ok) {
      const deleteFilt = itmes.filter((filt) => filt.id !== id);
      itmes = deleteFilt;
      console.log(itmes);

      console.log("delete successfuly");
      itmes = deleteFilt;
      apiCall(deleteFilt);
    }
    // submitBtn.disabled = false;
  } catch (error) {
    showErrorAlert( "netWork Problem" + error.message);
  }finally{
    protect.innerText = falseprotect
  }
  
}

   
deleteData();

function copyButton(button) {
  const row = button.closest('tr');
  const cells = row.querySelectorAll('td');
  const rowData = Array.from(cells).map(cell => cell.textContent).join(' | ');

  navigator.clipboard.writeText(rowData)
      .then(() => {
          console.log('Copied:', rowData);
          showCopiedNotification(rowData);
      })
      .catch(error => {
        console.log("Copy failed: " + error.message);
      });
}

function showCopiedNotification() {
  const copiedTextSpan = document.getElementById("copiedTextSpan");
  copiedTextSpan.textContent = "";

  // const copiedTextNotification = document.getElementById("copiedTextNotification");
  copiedDataDiv.style.display = "block";
  setTimeout(() => {
    copiedDataDiv.style.display = "none";
  }, 2000); // Display for 2 seconds
}




submitBtn.addEventListener("click", (e) => {
  const btnBox = e.target.innerText;

  if (btnBox === "Create") {
    addData();
  } else {
    editData();
  } 
});

document.addEventListener("DOMContentLoaded", () => {
  apiData();
});

