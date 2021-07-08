import { deleteAmount ,editAmount } from "./store.js"
import { initializeEditForm } from "./uiController.js"
initializeEditForm
export default class Amount {
    constructor(amount , type , category , date , description ,id){
        this.id = id
        this.amount = parseInt(amount)
        this.type = type
        this.category = category,
        this.date = new Date(date),
        this.description = description
    }
    getTablerow(){
        let row = document.createElement('tr')
        row.classList.add('text-light' ,'text-xl')
        if(this.type === 'income'){
            row.classList.add('bg-success')
        }else{
            row.classList.add('bg-danger')
        } 

        row.innerHTML = `
            <td scope="row">${this.id}</td>
            <td>${this.description}</td>
            <td>${this.category}</td>
            <td>${this.date.toDateString()}</td>
            <td>Nrs ${this.amount}</td>
        `
        let tabledataedit = document.createElement('td')
        let editbutton = document.createElement('button')
        editbutton.classList.add('btn', 'btn-outline-primary')
        editbutton.innerText = 'Edit'
        editbutton.addEventListener('click', ()=>{
            initializeEditForm(this.id)
        })
        tabledataedit.appendChild(editbutton)
        row.appendChild(tabledataedit)


        let tabledata = document.createElement('td');
        let deletebutton = document.createElement('button')
        deletebutton.classList.add('btn', 'btn-outline-light')
        deletebutton.innerText = 'Delete'
        deletebutton.addEventListener('click' , ()=>{
            deleteAmount(this.id)
        })
        tabledata.appendChild(deletebutton)
        row.appendChild(tabledata)
        return row
    }
}