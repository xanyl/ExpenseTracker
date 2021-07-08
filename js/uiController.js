import { chartdisplay } from "./app.js";
import { amounts, getmonthlyData } from "./store.js";
import { dataTableBody ,totalIncome ,alerts, totalExpense , totalBanner , editItemForm } from "./uielements.js";

export default function render(){

    dataTableBody.innerHTML = ''
    alerts.innerHTML = ''
    let monthlyLimitExceeded = amounts.isMonthlyLimitExceeded()[0]
    let dailyLimitExceeded = amounts.isDailyLimitExceeded()[0]

    if(monthlyLimitExceeded){
        let alertbadge = document.createElement('div')
        alertbadge.classList.add('alert', 'alert-danger')
        alertbadge.innerText = `Monthly Limit exceeded by Nrs. ${amounts.isMonthlyLimitExceeded()[1]}`
        alerts.appendChild(alertbadge)
    }

    if(dailyLimitExceeded){
        let alertbadge = document.createElement('div')
        alertbadge.classList.add('alert', 'alert-danger')
        alertbadge.innerText = `Daily Limit exceeded by Nrs. ${amounts.isDailyLimitExceeded()[1]}`
        alerts.appendChild(alertbadge)
    }
    
    if(!monthlyLimitExceeded && !dailyLimitExceeded){
        let alertbadge = document.createElement('div')
        alertbadge.classList.add('alert', 'alert-success')
        alertbadge.innerText = `No limit Exceeded`
        alerts.appendChild(alertbadge)
    }


    amounts.getdata().forEach(amount=>{
        dataTableBody.appendChild(amount.getTablerow())
    })
    totalIncome.innerText = `Nrs. ${amounts.getTotalIncome()}`
    totalExpense.innerText = `Nrs. ${amounts.getTotalExpense()}`
    totalBanner.innerText = `Nrs. ${amounts.getTotal()}`
    let montharray = [1,2,3,4,5,6,7,8,9,10,11,12]

    let expensedata = montharray.map(month => getmonthlyData(month , 'expense'))
    let incomedata = montharray.map(month => getmonthlyData(month , 'income'))

    chartdisplay.data.datasets = [
        {
            label : 'expense',
            backgroundColor : 'rgb(255 ,0 ,0)',
            borderColor : 'rgb(255,0,0)',
            data : expensedata
        },
        {
            label : 'income',
            backgroundColor : 'rgb(0 ,255 ,0)',
            borderColor : 'rgb(0,255,0)',
            data : incomedata
        }
    ]
    chartdisplay.update()
}

export function initializeEditForm(id){
    $('#edit_model_id').modal('toggle')
    let amount = amounts.data.find((value)=>{
       return value.id == id
    })
    editItemForm.elements.edit_amount_id.value = amount.id
    editItemForm.elements.amount.value = amount.amount
    editItemForm.elements.amount_type.value = amount.type
    editItemForm.elements.amount_category.value = amount.category

    let month = amount.date.getMonth() + 1
    let date = amount.date.getDate()

    editItemForm.elements.amount_date.value =
     `${amount.date.getFullYear()}-${month<10 ? '0'+month : month}-${date<10 ? '0'+date : date}`
    editItemForm.elements.amount_description.value = amount.description
}