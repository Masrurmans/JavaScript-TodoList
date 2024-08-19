const box = document.querySelector(".box")

const inputSearch = document.querySelector(".inputSearch") 
const btnAdd = document.querySelector(".btnAdd")
const sort = document.querySelector(".btnSort")

const addDialog = document.querySelector(".addDialog")
const addForm = document.querySelector(".addForm")
const addName = document.querySelector(".addName")

const editDialog = document.querySelector(".editDialog")
const editForm = document.querySelector(".editForm")
const editName = document.querySelector(".editName")

const Api = "https://66b99bf3fa763ff550f8d727.mockapi.io/API"

let idx = null

async function Get(){
    try {
        const response = await fetch(Api)
        const data = await response.json()
        getData(data)
    } catch (error) {
        console.error(error)
    }
}


async function Post(obj){
    try {
        const response = await fetch(Api, {
            method: "POST",
             headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
             },
             body: JSON.stringify(obj),
        })
        Get()
    } catch (error) {
        console.error(error)
    }
}
btnAdd.onclick =()=>{
    addDialog.showModal()
}   
addForm.onsubmit =(event)=>{
    event.preventDefault()
    let obj={
        name:addForm["addName"].value,
        status: false,
    }
    Post(obj)
    addDialog.close()
}


async function Delete(id){
    try {
        const response = await fetch(`${Api}/${id}`, {method: "DELETE"})
        Get()
    } catch (error) {
        console.error(error)
    }
}


async function Put(id, obj){
    try {
        const response = await fetch(`${Api}/${id}`,{
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(obj),
        })
        console.log(id);
        Get()
        editDialog.close()
    } catch (error) {
        console.error(error)
    }
}
const openEditDialog =(e)=>{
    editDialog.showModal()
    editForm["editName"].value = e.name
    idx = e.id
}
editForm.onsubmit =(event)=>{
    event.preventDefault()
    let obj={
        name:editForm["editName"].value,
        status: false,
    }
    Put(idx, obj)
    editDialog.close()
}


async function Get(searchWord){
    try {
    const response = await fetch(searchWord ? Api + "?name=" + searchWord : Api)
    const data = await response.json()
    getData(data)
    } catch (error) {
        console.error(error)
    }
}
inputSearch.oninput=(event)=>{
    Get(event.target.value)
}

async function PutData(e){
    let obj ={
        name: e.name,
        status: !e.status
    }
    try {
        const response = await fetch(`${Api}/${e.id}`,{
            method: "PUT",
            headers: {
                Accept: 'application/json',
                "Content-Type": "application/json",
            },
            body: JSON.stringify(obj),
        })
        Get()
    } catch (error) {
        console.error(error)
    }
}


sort.onclick = async () => {
    try {
      const response = await fetch(Api);
      let data = await response.json();
      data.sort((a, b) => a.name.localeCompare(b.name));
      getData(data);
    } catch (error) {
      console.error(error);
    }
  };


function getData(data){
    box.innerHTML = ""
    data.forEach((e,i)=> {
        const tr = document.createElement("tr")
        const buttons = document.createElement("td")
        const tdId = document.createElement("td")
        const tdName = document.createElement("td")
        const tdStatus = document.createElement("td")
        const btnEdit = document.createElement("button")
        const btnDelete = document.createElement("button")
        const Checkbox = document.createElement("input")
        Checkbox.type = "checkbox"
        
        tdId.innerHTML = i+1
        tdName.innerHTML = e.name
        tdStatus.innerHTML = e.status?"Active":"Inactive"
        Checkbox.checked = e.status
        btnEdit.innerHTML = "Edit"
        btnDelete.innerHTML = "Delete"


        Checkbox.onclick =()=>{
            PutData(e)
        }
        if(e.status){
            tdName.style.textDecoration = "line-through"
            tdName.style.textDecorationColor = "red"
            tdStatus.style.color = "green"
        }
        else{
            tdName.style.textDecoration = "none"
            tdStatus.style.color = "red"
        }


        btnEdit.onclick =()=>{
            openEditDialog(e)
        }

        btnDelete.onclick =()=>{
            Delete(e.id)
        }

        btnEdit.classList.add("btnEdit")
        btnDelete.classList.add("btnDelete")
        tr.classList.add("tr")
        box.classList.add("box")
        buttons.classList.add("buttons")
        Checkbox.classList.add("Checkbox")
        buttons.append(btnEdit, btnDelete, Checkbox)
        tr.append(tdId, tdName, tdStatus, buttons)
        box.appendChild(tr)
    })
}
Get()


const deleteDuplicatesBtn = document.createElement('button');
deleteDuplicatesBtn.innerHTML = "Delete Duplicates";
deleteDuplicatesBtn.onclick = deleteDuplicates;
document.querySelector('.ddd').appendChild(deleteDuplicatesBtn);
deleteDuplicatesBtn.classList.add("deleteDuplicatesBtn")

async function deleteDuplicates() {
    try {
        const response = await fetch(Api);
        let data = await response.json();
        const uniqueTasks = {};
        const duplicateIds = [];
        data.forEach(task => {
            if (uniqueTasks[task.name]) {
                duplicateIds.push(task.id);
            } else {
                uniqueTasks[task.name] = task.id;
            }
        });
        for (const id of duplicateIds) {
            await fetch(`${Api}/${id}`, { method: "DELETE" });
        }
        Get(); 
    } catch (error) {
        console.error(error);
    }
}
Get();
