import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class Income {

    constructor() {

        this.incomes = null
        this.cardRemoveButton = null


        document.getElementById('create-income').onclick = () => {
            console.log("CreATE INCOME")
            location.href = '#/createIncome'
        }


        this.init()
    }

    async init() {
        try {
            const result = await CustomHttp.request(`${config.host}/categories/income`)
            console.log(result)

            if (result) {
                this.incomes = result
                this.showIncomeCategories()
            } else {
                alert('Категория пуста!')
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
                // this.cardRemoveButton.setAttribute('data-bs-target', "#exampleModal")
                // this.cardRemoveButton.setAttribute('data-bs-toggle', "modal")


                card.appendChild(cardTitle)
                card.appendChild(cardEditButton)
                card.appendChild(this.cardRemoveButton)
                cardWrapper.prepend(card)
            })
        }

        this.cardRemoveButton.onclick = () => {
            console.log("CLICK remove")
            this.cardRemoveButton.setAttribute('data-bs-target', "#exampleModal")
            this.cardRemoveButton.setAttribute('data-bs-toggle', "modal")
        }


    }

}