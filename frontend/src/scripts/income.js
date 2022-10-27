import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class Income {

    constructor(page) {
        this.page = page
        this.incomes = null
        this.cardRemoveButton = null
        this.removeCardId = null
        this.editCardId = null
        this.urlParams = null
        if (this.page === "create-income") {
            this.urlParams = 'income'
        } else {
            this.urlParams = 'expense'
        }

        if (this.page === 'create-income' || this.page === 'create-expense') {

            this.createButton = document.getElementById('create-button')
            this.createInput = document.getElementById('create-input')
            this.createCancel = document.getElementById('create-cancel')

            this.createButton.onclick = () => {
                this.createInput.value
                this.createIncome()
            }

            this.createCancel.onclick = () => {
                location.href = '#/income'
            }

        } else {
            this.init()
        }
    }

    async init() {
        try {
            const result = await CustomHttp.request(`${config.host}/categories/${this.page}`)
            if (result) {
                this.incomes = result
                if (result.length === 0) {
                    // alert('Категория пуста!')
                    document.getElementById('empty-block').style.cssText = 'display:block!important'
                }
                this.showIncomeCategories()
            }
        } catch (e) {
            console.log(e)
        }

        if (this.page === 'income' || this.page === 'expense') {
            document.getElementById('create-income').onclick = () => {
                location.href = `#/create-${this.page}`
            }
        }

    }

    async createIncome() {
        try {
            const result = await CustomHttp.request(`${config.host}/categories/${this.urlParams}`, "POST", {
                title: this.createInput.value
            })

            if (result) {
                if (result.error) {
                    alert(result.message)
                    throw new Error(result.message)
                }
                location.href = `#/${this.urlParams}`

            }
        } catch (e) {
            console.log(e)
        }
    }

    showIncomeCategories() {

        const cardWrapper = document.getElementById('card-wrapper')

        if (this.incomes) {
            this.incomes.forEach(income => {

                const card = document.createElement('div')
                card.className = `p-3 border border-secondary rounded me-4 mb-3`
                card.style.cssText = "width: 352px"

                const cardTitle = document.createElement('div')
                cardTitle.innerText = income.title
                cardTitle.className = `fs-4 fw-bold pb-2`

                const cardEditButton = document.createElement('button')
                cardEditButton.innerText = "Редактировать"
                cardEditButton.className = `btn btn-primary me-2`
                cardEditButton.setAttribute('data-id', income.id)
                cardEditButton.setAttribute('data-name', "edit")

                this.cardRemoveButton = document.createElement('button')
                this.cardRemoveButton.innerText = "Удалить"
                this.cardRemoveButton.className = `btn btn-danger`
                this.cardRemoveButton.setAttribute('data-id', income.id)
                this.cardRemoveButton.setAttribute('data-bs-target', "#exampleModal")
                this.cardRemoveButton.setAttribute('data-bs-toggle', "modal")


                card.appendChild(cardTitle)
                card.appendChild(cardEditButton)
                card.appendChild(this.cardRemoveButton)
                cardWrapper.prepend(card)
            })
        }
        this.removeCard()
        this.editCard()
    }

    removeCard() {
        let removeButtons = document.querySelectorAll('.btn-danger')

        removeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.removeCardId = btn.getAttribute('data-id')
                console.log("this.removeCardId", this.removeCardId)
            })
        })

        document.getElementById('confirm-delete').onclick = () => {
            this.removeRequest()
        }

        document.getElementById('cancel-delete').onclick = () => {
            location.reload()
        }
    }

    async removeRequest() {
        try {
            const result = await CustomHttp.request(`${config.host}/categories/${this.page}/${this.removeCardId}`, 'DELETE')
            if (result) {
                if (!result.error) {
                    location.reload()
                }
                alert(result.message)
            }
        } catch (e) {
            console.log(e)
        }
    }

    editCard() {
        let editButtons = document.querySelectorAll('button[data-name="edit"]')

        editButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.editCardId = btn.getAttribute('data-id')
                location.href = `#/edit-${this.page}?id=${this.editCardId}`
            })
        })

    }

}