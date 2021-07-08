import Amount from "./Amount.js"
import render from "./uiController.js"
export const amounts = { data : [],
    filters : {
        from : null,
        to : null,
        type : null ,
        category : null , 
        search : null
    },
    limits :{
        daily : 5000,
        monthlyLimit : 100000
    },
    getdata(){
        let finaldata = this.data
        if(this.filters.from){
           finaldata= this.data.filter((value)=>{
                return value.date.getTime() >= this.filters.from.getTime()
            })
        }
        if(this.filters.to){
            finaldata= finaldata.filter((value)=>{
                return value.date.getTime() <= this.filters.to.getTime()
            })
        }
        if(this.filters.type){
            finaldata= finaldata.filter((value)=>{
                return value.type == this.filters.type
            })
        }
        if(this.filters.category){
            finaldata= finaldata.filter((value)=>{
                return value.category == this.filters.category
            })
        }
        if(this.filters.search){
            finaldata= finaldata.filter((value)=>{
                let description = value.description.toLowerCase()
                return description.includes(this.filters.search.toLowerCase())
            })
        }
        return finaldata
    },
    getTotalIncome(){
        let incomedata = this.getdata().filter(value =>{
            return value.type === 'income'
        })
        let totalIncome = 0
        incomedata.forEach(income=>{
            totalIncome+= income.amount
        })
        return totalIncome
    },
    getTotalExpense(){
        let incomedata = this.getdata().filter(value =>{
            return value.type !== 'income'
        })
        let totalExpense = 0
        incomedata.forEach(income=>{
            totalExpense+= income.amount
        })
        return totalExpense
    },
    getTotal(){
        return this.getTotalIncome() - this.getTotalExpense()
    },
    isDailyLimitExceeded(){
        let currentDay = new Date()
        let currentDate = currentDay.getDate()
        let curretMonth = currentDay.getMonth()
        let currentYear = currentDay.getFullYear()
        let todaysDate = new Date(`${currentYear}-${curretMonth+1}-${currentDate}`)
        let data= this.data.filter((value)=>{
                 return value.date.getTime() >= todaysDate.getTime()
        })
        let incomedata = data.filter(value =>{
            return value.type !== 'income'
        })
        let totalExpense = 0
        incomedata.forEach(income=>{
            totalExpense+= income.amount
        })
        return [totalExpense>this.limits.daily , totalExpense-this.limits.daily]
    },
    isMonthlyLimitExceeded(){
        let currentDay = new Date()
        let curretMonth = currentDay.getMonth()
        let currentYear = currentDay.getFullYear()
        let oneMonthBeforeDate = new Date(`${currentYear}-${curretMonth+1}-01`)
        let data= this.data.filter((value)=>{
                return value.date.getTime() >= oneMonthBeforeDate.getTime()
        })
        let incomedata = data.filter(value =>{
            return value.type !== 'income'
        })
        let totalExpense = 0
        incomedata.forEach(income=>{
            totalExpense+= income.amount
        })
        return [totalExpense>this.limits.monthlyLimit , totalExpense-this.limits.monthlyLimit]
    }

}

export function getNewId(){
    let lastId = 0
    if(localStorage.lastId){
        lastId = parseInt(localStorage.lastId)
    }
    lastId++
    localStorage.lastId = lastId
    return lastId
}

export function addAmount(amountdata){
    amounts.data.push(amountdata)
    localStorage.amounts = JSON.stringify(amounts.data)
    render()
}

export function initializeStore(){
    let data = []
    if(localStorage.amounts){
        data = JSON.parse(localStorage.amounts)
    }
    if(localStorage.limits){
        amounts.limits = JSON.parse(localStorage.limits)
    }
    data.forEach(element => {
        let {amount , type , category , date , description ,id} = element
        amounts.data.push(new Amount(amount , type , category , date , description ,id))
    });
    render()
}
export function deleteAmount(id){
    amounts.data = amounts.data.filter((value)=>{
       return value.id !== id
    })
    localStorage.amounts = JSON.stringify(amounts.data)
    render()
}

export function editAmount(id ,amount , type, category , date ,description){
    let index = amounts.data.findIndex((value)=>{
        return value.id == id
     })
    if(index !== -1){
        amounts.data[index].amount = amount
        amounts.data[index].type = type
        amounts.data[index].category = category
        amounts.data[index].date =new Date(date)
        amounts.data[index].description = description
    }
    localStorage.amounts = JSON.stringify(amounts.data)
    render()
}

export function applyFilters(from, to , type, category,search){
    if(from){
        amounts.filters.from = new Date(from)
    }
    if(to){
        amounts.filters.to = new Date(to)
    }
    amounts.filters.type = type
    amounts.filters.category = category
    amounts.filters.search = search

    render()
}

export function removeFilters(){
   amounts.filters =  {
        from : null,
        to : null,
        type : null ,
        category : null , 
        search : null
    }
    render()
}

export function setLimit(dailyLimit , monthlyLimit){
    amounts.limits.daily = dailyLimit
    amounts.limits.monthlyLimit = monthlyLimit
    localStorage.limits = JSON.stringify(amounts.limits)
}

export function getmonthlyData(month , type){

    let currentYear = new Date().getFullYear()
    let monthStart = new Date(`${currentYear}-${month}-01`)
    let monthEnd = new Date(`${currentYear}-${month+1}-01`)
    let data= amounts.data.filter((value)=>{
        return value.date.getTime() >= monthStart.getTime() && value.date.getTime() < monthEnd.getTime()
    })
    data = data.filter(value =>{
    return value.type == type
    })
    let total = 0
    data.forEach(income=>{
    total+= income.amount
    })
    return total
}
