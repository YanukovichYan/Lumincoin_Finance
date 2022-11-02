import {CustomHttp} from "../../../services/custom-http.js";
import config from "../../../config/config.js";
import {Sidebar} from "../sidebar.js";
import {SeparationCategories} from "../../../services/separationCategories.js";

export class Category {

    constructor(page) {
        this.page = page
        this.categories = null
        this.cardRemoveButton = null
        this.removeCardId = null
        this.editCardId = null
        this.urlParams = null
        this.amount = null

        this.page === "create-income" ? this.urlParams = 'income' : this.urlParams = 'expense'

        this.page === 'create-income' || this.page === 'create-expense' ? this.create() : this.init()

    }

    async init() {
        try {
            const result = await CustomHttp.request(`${config.host}/categories/${this.page}`)
            if (result) {
                this.categories = result
                if (result.length === 0) {
                    console.log('Категория пуста!')
                    document.getElementById('empty-block').style.cssText = 'display:block!important'
                }
                document.getElementById('card-wrapper').innerHTML = ' '
                this.showCategories()
                await Sidebar.getBalance()
                this.getOperations()
                // console.log("CATEGORY", result)
            }
        } catch (e) {
            console.log(e)
        }
        document.getElementById('create-category').onclick = () => location.href = `#/${this.page}/create-${this.page}`
    }

    showCategories() {
        const cardWrapper = document.getElementById('card-wrapper')
        if (this.categories) {
            this.categories.forEach(category => {

                const card = document.createElement('div')
                card.className = `p-3 border border-secondary rounded me-4 mb-3`
                card.style.cssText = "width: 352px"

                const cardTitle = document.createElement('div')
                cardTitle.innerText = category.title
                cardTitle.className = `fs-4 fw-bold pb-2`

                const cardEditButton = document.createElement('button')
                cardEditButton.innerText = "Редактировать"
                cardEditButton.className = `btn btn-primary me-2`
                cardEditButton.setAttribute('data-id', category.id)
                cardEditButton.setAttribute('data-name', "edit")

                this.cardRemoveButton = document.createElement('button')
                this.cardRemoveButton.innerText = "Удалить"
                this.cardRemoveButton.className = `btn btn-danger`
                this.cardRemoveButton.setAttribute('data-id', category.id)
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

    async getOperations() {
        try {
            const result = await CustomHttp.request(`${config.host}/operations?period=all`)
            if (result) {
                this.operations = result
                // await Sidebar.getBalance()
                // console.log('this.operations', this.operations)
            }
        } catch (e) {
            console.log(e)
        }
    }

    async create() {
        await Sidebar.getBalance()
        this.createButton = document.getElementById('create-button')
        this.createInput = document.getElementById('create-input')

        this.createButton.onclick = () => {
            this.createInput.value
            this.createCategoryRequest()
        }
        document.getElementById('create-cancel').onclick = () => location.href = `#/${this.urlParams}`
    }

    async createCategoryRequest() {
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

    removeCard() {
        let removeButtons = document.querySelectorAll('.btn-danger')

        removeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.removeCardId = btn.getAttribute('data-id')
                this.removeCategoryAmount()
            })
        })
        document.getElementById('confirm-delete').onclick = () => this.removeCardRequest()
    }

    async removeCategoryAmount() {
        if (this.removeCardId) {
            let amount = SeparationCategories.getSeparateCategory(this.operations, this.removeCardId, this.categories)

            const currentBalance = await Sidebar.getBalance()

            if (this.page === 'income') {
                this.amount = currentBalance - amount
            } else {
                this.amount = currentBalance + amount
            }

            console.log(currentBalance)
            console.log('111', this.amount)
        }
    }

    async removeCardRequest() {
        try {
            const result = await CustomHttp.request(`${config.host}/categories/${this.page}/${this.removeCardId}`, 'DELETE')
            if (result) {
                this.init()
                await Sidebar.updateBalance(this.amount)
                console.log(result.message)
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
                location.href = `#/${this.page}/edit-${this.page}?id=${this.editCardId}`
            })
        })
    }
}