import {CustomHttp} from "../../../services/custom-http.js";
import config from "../../../config/config.js";

export class TableCategories {

    constructor() {

        this.filterValue = `interval&dateFrom=${new Date().getFullYear()}-${(new Date().getMonth()) + 1}-${new Date().getDate()}&dateTo=${new Date().getFullYear()}-${(new Date().getMonth()) + 1}-${new Date().getDate()}`
        this.operations = null
        this.removeOptionId = null
        this.btnEditId = null
        this.dateInterval = ''

        this.btnFilterClick = null

        this.init()
    }

    init() {

        document.getElementById('create-income').onclick = () => {
            location.href = `#/create_income-or-expenses?operations=income`
        }

        document.getElementById('create-expense').onclick = () => {
            location.href = `#/create_income-or-expenses?operations=expense`
        }

        this.getDataTable()

        this.showFilterBtn()


    }

    async getDataTable() {

        const dateFrom = document.getElementById('date-from')
        const dateTo = document.getElementById('date-to')
        const dateInterval = document.getElementById('date-interval')

        dateInterval.onchange = () => {

            this.dateInterval = `&dateFrom=${dateFrom.value}&dateTo=${dateTo.value}`

            console.log('dateInterval', this.dateInterval)
        }

        try {
            const result = await CustomHttp.request(`${config.host}/operations?period=${this.filterValue}${this.dateInterval}`)
            if (result) {
                this.operations = result
                this.showTable()
                // console.log("Все операции для таблички", result)
            }
        } catch (e) {
            console.log(e)
        }
    }

    showFilterBtn() {

        config.theadTitle.forEach(ttl => {
            const title = document.createElement('th')
            title.innerText = ttl
            title.className = 'text-center'
            document.getElementById('thead').appendChild(title)
        })

        config.dataBtn.forEach(btn => {
            const filterBtn = document.createElement('button')
            filterBtn.innerText = btn
            filterBtn.setAttribute('data-name', 'filter')
            filterBtn.className = 'btn btn-light border border-secondary me-3 px-3'

            filterBtn.addEventListener('click', () => {
                this.btnFilterClick = filterBtn

                let allFilterBtn = document.querySelectorAll('button[data-name="filter"]')
                allFilterBtn.forEach(el => {
                    el.className = 'btn btn-light border border-secondary me-3 px-3'
                })

                this.btnFilterClick.className = 'btn btn-secondary border border-secondary me-3 px-3'

                document.getElementById('tbody').innerHTML = ' '

                this.showOperationsWithFilter()

            })


            document.getElementById('btn-wrapper').appendChild(filterBtn)

        })
    }

    showOperationsWithFilter() {

        console.log('this.btnFilterClick', this.btnFilterClick.innerText)

        const dateToday = `${new Date().getFullYear()}-${(new Date().getMonth()) + 1}-${new Date().getDate()}`

        switch (this.btnFilterClick.innerText) {
            case 'Сегодня':
                this.filterValue = `interval&dateFrom=${dateToday}&dateTo=${dateToday}`
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
            // default:
            // здесь нужно сделать today
            // break
        }
        this.getDataTable()

        console.log("this.filterValue", this.filterValue)
    }

    showTable() {

        // console.log('this.operations', this.operations)
        if (this.operations) {

            const tbody = document.getElementById('tbody')

            this.operations.forEach((operation, index) => {
                const tr = document.createElement('tr')

                const number = document.createElement('td')
                number.className = `text-center fw-bold`
                number.innerText = `${index + 1} `

                const type = document.createElement('td')
                type.className = operation.type === 'income' ? 'text-center text-success' : 'text-center text-danger'
                type.innerText = operation.type === 'income' ? 'доход' : 'расход'

                const category = document.createElement('td')
                category.className = `text-center`
                category.innerText = operation.category || null

                const amount = document.createElement('td')
                amount.className = `text-center`
                amount.innerText = `${operation.amount} $`

                const validDate = operation.date.split('-')
                const date = document.createElement('td')
                date.className = `text-center`
                date.innerText = `${validDate[2]}.${validDate[1]}.${validDate[0]}`

                const comment = document.createElement('td')
                comment.className = `text-center`
                comment.innerText = operation.comment

                const trash = document.createElement('td')
                trash.className = `text-center`
                trash.setAttribute('role', 'button')
                trash.setAttribute('data-name', 'delete')
                trash.setAttribute('data-id', operation.id)
                trash.setAttribute('data-bs-target', "#exampleModal")
                trash.setAttribute('data-bs-toggle', "modal")

                const trashImg = document.createElement('img')
                trashImg.setAttribute('src', './src/static/images/trash-icon.png')
                trashImg.setAttribute('alt', 'trash')
                trash.appendChild(trashImg)

                const edit = document.createElement('td')
                edit.className = `text-center`
                edit.setAttribute('role', 'button')
                edit.setAttribute('data-name', 'edit')
                edit.setAttribute('data-id', operation.id)

                const editImg = document.createElement('img')
                editImg.setAttribute('src', './src/static/images/pen-icon.png')
                editImg.setAttribute('alt', 'pen')
                edit.appendChild(editImg)

                tr.appendChild(number)
                tr.appendChild(type)
                tr.appendChild(category)
                tr.appendChild(amount)
                tr.appendChild(date)
                tr.appendChild(comment)
                tr.appendChild(trash)
                tr.appendChild(edit)

                tbody.appendChild(tr)
            })
        }
        this.removeOption()
        this.edit()
    }

    async removeOption() {
        let removeOptions = document.querySelectorAll('td[data-name="delete"]')

        removeOptions.forEach(option => {
            option.addEventListener('click', () => {
                this.removeOptionId = option.getAttribute('data-id')
                console.log(this.removeOptionId)

            })
        })

        document.getElementById('confirm-delete').onclick = () => {
            this.removeOptionRequest()
        }

        document.getElementById('cancel-delete').onclick = () => {
            location.reload()
        }
    }

    async removeOptionRequest() {
        try {
            const result = await CustomHttp.request(`${config.host}/operations/${this.removeOptionId}`, 'DELETE')

            if (result) {
                if (!result.error) {
                    alert(result.message)
                    location.reload()
                }
            }
        } catch (e) {
            console.log(e)
        }
    }

    edit() {
        const editButtons = document.querySelectorAll('td[data-name="edit"]')

        editButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.btnEditId = btn.getAttribute('data-id')
                // console.log('EDIT', this.btnEditId)
                location.href = `#/edit_income-or-expense?id=${this.btnEditId}`
            })
        })


    }

}