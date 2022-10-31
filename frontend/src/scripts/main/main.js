import config from "../../../config/config.js";
import {CustomHttp} from "../../../services/custom-http.js";

export class Main {

    constructor() {

        this.chartIncome = document.getElementById('chart-income').getContext('2d')
        this.chartExpense = document.getElementById('chart-expense').getContext('2d')

        this.categoriesIncome = []
        this.categoriesExpense = []
        this.operations = []

        this.incomeDataAmount = []
        this.expenseDataAmount = []

        this.getCategoriesIncome()
        this.getCategoriesExpense()
        this.showFilterBtn()
        this.getDataTable()
    }

    showFilterBtn() {

        let active = true;

        config.dataBtn.forEach((btn, index) => {
            const filterBtn = document.createElement('button')
            filterBtn.innerText = btn
            filterBtn.setAttribute('data-name', 'filter')
            filterBtn.className = 'btn btn-light border border-secondary me-3 px-3'

            if (active && index === 0) filterBtn.className = 'btn btn-secondary border border-secondary me-3 px-3'

            filterBtn.addEventListener('click', () => {
                active = false
                this.btnFilterClick = filterBtn
                this.dateInterval = ''

                let allFilterBtn = document.querySelectorAll('button[data-name="filter"]')
                allFilterBtn.forEach(el => {
                    el.className = 'btn btn-light border border-secondary me-3 px-3'
                })

                this.btnFilterClick.classList.add('btn-secondary')
                this.btnFilterClick.classList.remove('btn-light')

            })
            document.getElementById('btn-wrapper').appendChild(filterBtn)
        })
    }

    async getCategoriesIncome() {
        try {
            const result = await CustomHttp.request(`${config.host}/categories/income`)
            if (result) {
                this.categories = result
                if (result.length === 0) {
                    console.log('Категорий нет!')
                }
                result.forEach(el => {
                    this.categoriesIncome.push(el.title)
                })
                // console.log(this.categoriesIncome)

                // this.categoriesIncome = result
                // console.log('income', result)
            }
        } catch (e) {
            console.log(e)
        }
    }

    async getCategoriesExpense() {
        try {
            const result = await CustomHttp.request(`${config.host}/categories/expense`)
            if (result) {
                this.categories = result
                if (result.length === 0) {
                    console.log('Категорий нет!')
                }

                result.forEach(el => {
                    this.categoriesExpense.push(el.title)
                })
                // console.log(this.categoriesExpense)

                // this.categoriesExpense = result
                // console.log('expense', result)
            }
        } catch (e) {
            console.log(e)
        }
    }

    incomeChartShow() {
        new Chart(this.chartIncome, {
            type: 'pie',
            responsive: false,
            data: {
                labels: this.categoriesIncome,
                datasets: [{
                    label: 'Population',
                    data: this.incomeDataAmount,
                    backgroundColor: [
                        '#DC3545',
                        '#20C997',
                        '#0D6EFD',
                        '#FFC107',
                        '#FD7E14',
                    ]
                }]
            },
            options: {
                responsive: false,
                plugins: {
                }
            },
        })


    }

    expenseChartShow() {
        new Chart(this.chartExpense, {
            type: 'pie',
            responsive: false,
            data: {
                labels: this.categoriesExpense,
                datasets: [{
                    data: this.expenseDataAmount,
                    backgroundColor: [
                        '#0D6EFD',
                        '#FFC107',
                        '#20C997',
                        '#FD7E14',
                        '#DC3545',
                    ]
                }]
            },
            options: {
                responsive: false,
                plugins: {
                }
            },
        })
    }

    async getDataTable() {
        // if (this.filterValue === 'interval' && this.dateInterval === '') {
        //     return
        // }
        try {
            // const result = await CustomHttp.request(`${config.host}/operations?period=${this.filterValue}${this.dateInterval}`)
            const result = await CustomHttp.request(`${config.host}/operations?period=all`)
            if (result) {
                this.operations = result
                this.separationCategories()
            }
        } catch (e) {
            console.log(e)
        }
    }

    separationCategories() {
        const incomeOperation = this.operations.filter((el) => {
            return el.type === 'income'
        })
        const expenseOperation = this.operations.filter((el) => {
            return el.type === 'expense'
        })

        const newObjectIncome = incomeOperation.reduce((object, operation) => {
            if (object[operation.category]) {
                object[operation.category].push(operation)
            } else {
                object[operation.category] = [operation]
            }
            return object
        }, {})

        const newObjectExpense = expenseOperation.reduce((object, operation) => {
            if (object[operation.category]) {
                object[operation.category].push(operation)
            } else {
                object[operation.category] = [operation]
            }
            return object
        }, {})

        console.log('newObjectIncome', newObjectIncome)
        console.log('newObjectExpense', newObjectExpense)

        Object.entries(newObjectIncome).forEach(category => {
            let amount = 0
            category[1].forEach(operation => {
                amount += operation.amount
            })
            this.incomeDataAmount.push(amount)
        })

        Object.entries(newObjectExpense).forEach(category => {
            let amount = 0
            category[1].forEach(operation => {
                amount += operation.amount
            })
            this.expenseDataAmount.push(amount)
        })
        console.log('incomeDataAmount', this.incomeDataAmount)
        console.log('expenseDataAmount', this.expenseDataAmount)

        if (this.incomeDataAmount.length) {
            this.incomeChartShow()
        }

        if (this.expenseDataAmount.length){
            this.expenseChartShow()
        }

        if ( this.incomeDataAmount.length === 0 && this.expenseDataAmount.length ===0) {
            document.getElementById('main').style.display = 'none'
            document.getElementById('empty-block').style.display = 'block'
        } else {
            document.getElementById('main').style.display = 'block'
            document.getElementById('empty-block').style.display = 'none'
        }

        // console.log(incomeOperation)
        // console.log(expenseOperation)
    }


}