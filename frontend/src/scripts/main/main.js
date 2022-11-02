import config from "../../../config/config.js";
import {CustomHttp} from "../../../services/custom-http.js";
import {Sidebar} from "../sidebar.js";

export class Main {

    constructor() {

        this.chartIncome = document.getElementById('chart-income').getContext('2d')
        this.chartExpense = document.getElementById('chart-expense').getContext('2d')

        this.dateToday = `${new Date().getFullYear()}-${(new Date().getMonth()) + 1}-${new Date().getDate()}`
        this.filterValue = `interval&dateFrom=${this.dateToday}&dateTo=${this.dateToday}`

        this.dateInterval = ''
        this.btnFilterClick = null

        this.categoriesIncome = []
        this.categoriesExpense = []

        this.operations = []

        this.incomeDataAmount = []
        this.expenseDataAmount = []

        this.myChartIncome = null
        this.myChartExpense = null

        this.intervalInit()
    }

    intervalInit() {

        const dateFrom = document.getElementById('date-from')
        const dateTo = document.getElementById('date-to')
        const dateInterval = document.getElementById('date-interval')


        dateInterval.onchange = () => {
            const dateInterval = `&dateFrom=${dateFrom.value}&dateTo=${dateTo.value}`
            if (dateFrom.value && dateTo.value) {
                this.dateInterval = dateInterval
                this.getDataTable()
                console.log('this.dateInterval', this.dateInterval)
                console.log('Получили данные, отправляем запрос')
            }
        }
        this.showFilterBtn()
        this.getDataTable()
    }

    async getDataTable() {
        if (this.filterValue === 'interval' && this.dateInterval === '') {
            return
        }
        try {
            const result = await CustomHttp.request(`${config.host}/operations?period=${this.filterValue}${this.dateInterval}`)
            if (result) {
                this.operations = result
                await Sidebar.getBalance()
                // console.log('this.operations', this.operations)
                this.separationCategories()
            }
        } catch (e) {
            console.log(e)
        }
    }

    showFilterBtn() {
        let active = true;
        config.dataBtn.forEach((btn, index) => {
            const filterBtn = document.createElement('button')
            filterBtn.innerText = btn
            filterBtn.setAttribute('data-name', 'filter')
            filterBtn.className = 'btn btn-light border border-secondary me-3 px-3'

            if (active && index === 0) {
                filterBtn.classList.remove('btn-light')
                filterBtn.classList.add('btn-secondary')
            }

            filterBtn.addEventListener('click', () => {
                // console.log(filterBtn)
                active = false
                this.btnFilterClick = filterBtn
                this.dateInterval = ''

                let allFilterBtn = document.querySelectorAll('button[data-name="filter"]')
                allFilterBtn.forEach(el => {
                    el.classList.add('btn-light')
                    el.classList.remove('btn-secondary')
                })

                this.btnFilterClick.classList.add('btn-secondary')
                this.btnFilterClick.classList.remove('btn-light')

                this.categoriesIncome = []
                this.categoriesExpense = []

                this.incomeDataAmount = []
                this.expenseDataAmount = []
                this.selectOperationsWithFilter()
            })
            document.getElementById('btn-wrapper').appendChild(filterBtn)
        })
    }

    selectOperationsWithFilter() {
        switch (this.btnFilterClick.innerText) {
            case 'Сегодня':
                this.filterValue = `interval&dateFrom=${this.dateToday}&dateTo=${this.dateToday}`
                break
            case 'Неделя':
                this.filterValue = 'week'
                break
            case 'Месяц':
                this.filterValue = 'month'
                break
            case 'Год':
                this.filterValue = 'year'
                break
            case 'Все':
                this.filterValue = 'all'
                break
            case 'Интервал':
                this.filterValue = 'interval'
                break
        }
        this.getDataTable()
    }

    incomeChartShow() {

        if (this.myChartIncome != null) {
            this.myChartIncome.destroy()
        }

        this.myChartIncome = new Chart(this.chartIncome, {
            type: 'pie',
            responsive: false,
            data: {
                labels: this.categoriesIncome,
                datasets: [{
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
                plugins: {}
            },
        })
    }

    expenseChartShow() {

        if (this.myChartExpense != null) {
            this.myChartExpense.destroy()
        }

        this.myChartExpense = new Chart(this.chartExpense, {
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
                plugins: {}
            },
        })
    }

    separationCategories() {
        const incomeOperation = this.operations.filter((el) => {
            return el.type === 'income'
        })
        const expenseOperation = this.operations.filter((el) => {
            return el.type === 'expense'
        })

        console.log('incomeOperation', incomeOperation)
        console.log('expenseOperation', expenseOperation)

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

        console.log('Object.entries(income)', Object.entries(newObjectIncome))
        console.log('Object.entries(expense)', Object.entries(newObjectExpense))

        Object.entries(newObjectIncome).forEach(category => {
            this.categoriesIncome.push(category[0])
        })

        Object.entries(newObjectExpense).forEach(category => {
            this.categoriesExpense.push(category[0])
        })

        console.log('this.categoriesIncome', this.categoriesIncome)
        console.log('this.categoriesExpense', this.categoriesExpense)

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

        if (this.expenseDataAmount.length) {
            this.expenseChartShow()
        }

        if (this.incomeDataAmount.length === 0 && this.expenseDataAmount.length === 0) {
            document.getElementById('main').style.display = 'none'
            document.getElementById('empty-block').style.display = 'block'
        } else {
            document.getElementById('main').style.display = 'block'
            document.getElementById('empty-block').style.display = 'none'
        }
    }
}