import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class Income {

    constructor(page) {

        this.page = page
        this.incomes = null
        this.cardRemoveButton = null
        this.removeCardId = null


        if (this.page === 'createIncome') {

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
            document.getElementById('create-income').onclick = () => {
                location.href = '#/createIncome'
            }

            this.init()
        }

    }

    async init() {

        try {
            const result = await CustomHttp.request(`${config.host}/categories/income`)

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
    }

    async createIncome() {
        try {
            const result = await CustomHttp.request(`${config.host}/categories/income`, "POST", {
                title: this.createInput.value
            })
            if (result) {
                if (result.error) {
                    alert(result.message)
                    throw new Error(result.message)
                }
                console.log(result)
                location.href = '#/income'

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

        let removeButtons = document.querySelectorAll('.btn-danger')

        removeButtons.forEach(removeButton => {

            removeButton.addEventListener('click', (e) => {
                this.removeCardId = removeButton.getAttribute('data-id')
                console.log("this.removeCardId", this.removeCardId)

            })
        })

        document.getElementById('confirmDelete').onclick = () => {
            this.removeCard()
        }


    }

    async removeCard() {
        try {
            const result = await CustomHttp.request(`${config.host}/categories/income/${this.removeCardId}`, 'DELETE')
            if (result) {
                if (!result.error) {
                    location.reload()
                }
                // alert(result.message)
            }
        } catch (e) {
            console.log(e)
        }
    }
}