import {CustomHttp} from "../../../services/custom-http.js";
import config from "../../../config/config.js";

export class TableCategories {

    constructor() {

        this.filter = "all"
        this.operations = null
        this.removeOptionId = null

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
    }

    async getDataTable() {

        try {

            const result = await CustomHttp.request(`${config.host}/operations?period=${this.filter}`)

            if (result) {
                this.operations = result

                // console.log("Все операции для таблички", result)
                this.showFilterBtn()
                this.showTable()

            }

        } catch (e) {
            console.log(e)
        }

    }


    showFilterBtn() {
        config.dataBtn.forEach(btn => {
            const filterBtn = document.createElement('button')
            filterBtn.innerText = btn
            filterBtn.className = 'btn btn-light border border-secondary me-3 px-3'

            document.getElementById('btn-wrapper').appendChild(filterBtn)

        })
    }

    showTable() {
        config.theadTitle.forEach(ttl => {
            const title = document.createElement('th')
            title.innerText = ttl
            title.className = 'text-center'
            document.getElementById('thead').appendChild(title)
        })
        console.log('this.operations', this.operations)
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
        console.log(editButtons)

        // document.getElementById('pen').onclick = () => {
        //     location.href = '#/edit_income-or-expense'
        // }

    }

}