import {CustomHttp} from "../../../services/custom-http.js";
import config from "../../../config/config.js";

export class Category {

    constructor(page) {
        this.page = page
        this.categories = null
        this.cardRemoveButton = null
        this.removeCardId = null
        this.editCardId = null
        this.urlParams = null

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
                this.showCategories()
                // console.log("CATEGORY", result)
            }
        } catch (e) {
            console.log(e)
        }
        document.getElementById('create-category').onclick = () => location.href = `#/${this.page}/create-${this.page}`
    }

    create() {
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

    removeCard() {
        let removeButtons = document.querySelectorAll('.btn-danger')

        removeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.removeCardId = btn.getAttribute('data-id')
            })
        })

        document.getElementById('confirm-delete').onclick = () => this.removeCardRequest()

        // document.getElementById('cancel-delete').onclick = () => {
        //
        //     document.getElementsByClassName('modal-backdrop')[0].style.display = 'none'
        //     document.getElementById('exampleModal').style.display = 'none'
        //
        //     if (document.getElementsByTagName('body')[0].classList.contains('modal-open')) {
        //         document.getElementsByTagName('body')[0].classList.remove('modal-open')
        //     }
        //     console.log()
        //     if (document.getElementById('exampleModal').classList.contains('show')) {
        //         document.getElementById('exampleModal').classList.remove('show')
        //         console.log('1')
        //     }
            // // location.reload()
            //
            // if (document.getElementById('exampleModal').getAttribute('aria-modal')) {
            //     document.getElementById('exampleModal').removeAttribute('aria-modal')
            //     console.log('2')
            // }
            //
            // if (document.getElementById('exampleModal').getAttribute('role')) {
            //     document.getElementById('exampleModal').removeAttribute('role')
            //     console.log('3')
            // }
        // }
    }

    async removeCardRequest() {
        try {
            const result = await CustomHttp.request(`${config.host}/categories/${this.page}/${this.removeCardId}`, 'DELETE')
            if (result) {
                if (!result.error) {
                    location.reload()
                }
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