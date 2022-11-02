import {CustomHttp} from "../../../services/custom-http.js";
import config from "../../../config/config.js";
import {Sidebar} from "../sidebar.js";

export class Form {

    constructor(page) {
        this.page = page
        this.categories = null
        this.createFormValue = null
        this.optionById = null
        this.optionId = null
        this.urlParams = window.location.href.split('=')[1]
        this.urlSelectType = null

        if (this.page === 'create') this.urlSelectType = this.urlParams

        this.getType = null
        this.selectType = document.getElementById('select-type')
        this.selectCategory = document.getElementById('select-category')
        this.amount = document.getElementById('amount')
        this.date = document.getElementById('date')
        this.comment = document.getElementById('comment')

        this.init()
    }

    init() {
        if (this.page === 'edit') {
            const saveBtn = document.getElementById('save')
            saveBtn.innerText = 'Сохранить'
            saveBtn.onclick = () => this.edit()
            document.getElementById('cancel').onclick = () => location.href = '#/table-categories'

            this.getOperationById()
        }
        this.fillingForm()
    }

    async getOperationById() {
        this.optionId = location.hash.split('=')[1]
        try {
            const result = await CustomHttp.request(`${config.host}/operations/${this.optionId}`)
            if (result) {
                if (result.error) {
                    alert(result.message)
                }
                this.optionById = result
                this.editFormValue()
            }
        } catch (e) {
            console.log(e)
        }
    }

    editFormValue() {
        this.optionById.type === 'income' ? this.selectType.selectedIndex = 1 : this.selectType.selectedIndex = 2
        this.optionById.type === 'income' ? this.getType = 'income' : this.getType = 'expense'
        this.urlSelectType = this.getType
        this.getCategories()
        this.amount.value = this.optionById.amount
        this.date.value = this.optionById.date
        this.comment.value = this.optionById.comment
    }

    async getCategories() {
        if (this.urlSelectType) {
            try {
                const result = await CustomHttp.request(`${config.host}/categories/${this.urlSelectType}`)
                if (result) {
                    this.categories = result
                    if (result.length === 0) {
                        console.log('Категорий нет!')
                    }
                    await Sidebar.getBalance()
                }
            } catch (e) {
                console.log(e)
            }
        }
        this.showCategoryOptions()
    }

    showCategoryOptions() {
        if (this.categories) {
            const defaultOption = document.createElement('option')
            defaultOption.innerText = 'Категория...'
            defaultOption.setAttribute('hidden', 'hidden')
            defaultOption.setAttribute('selected', 'selected')
            document.getElementById('select-category').appendChild(defaultOption)

            this.categories.forEach(option => {
                const optionCategory = document.createElement('option')
                optionCategory.innerText = option.title
                optionCategory.value = option.id
                document.getElementById('select-category').appendChild(optionCategory)
            })
            if (this.page === 'edit') this.showSelectCategory()
        }
    }

    showSelectCategory() {
        if (this.categories) {
            const selectedCategoryIndex = this.categories.findIndex(category => category.title === this.optionById.category)
            this.selectCategory.selectedIndex = selectedCategoryIndex + 2
        }
    }


    fillingForm() {

        this.getCategories()

        this.urlParams === 'income' ? this.selectType.selectedIndex = 1 : this.selectType.selectedIndex = 2

        this.selectType.onchange = () => {
            this.selectCategory.innerHTML = ' '
            this.urlSelectType = this.selectType.value
            this.getCategories()
        }

        document.getElementById('form').onchange = () => {

            this.urlSelectType = this.selectType.value

            this.createFormValue = {
                type: this.selectType.value,
                amount: +(this.amount.value),
                date: this.date.value,
                comment: this.comment.value,
                category_id: +(this.selectCategory.value),
            }
        }

        if (this.page === 'create') document.getElementById('save').onclick = () => this.create()

        document.getElementById('cancel').onclick = () => location.href = '#/table-categories'
    }

    async create() {

        const currentBalance = await Sidebar.getBalance()
        console.log('currentBalance', currentBalance)

        if (this.selectType.value === 'income') {
            this.value = currentBalance + +(this.amount.value)
        } else {
            this.value = currentBalance - +(this.amount.value)
        }
        console.log(+(this.amount.value))
        console.log(this.value)

        try {
            const result = await CustomHttp.request(`${config.host}/operations`, 'POST', this.createFormValue)
            if (result) {
                if (result.error) {
                    alert(result.message)
                }
                if (result && !result.error) {
                    await Sidebar.updateBalance(this.value)
                    await Sidebar.getBalance()
                    location.href = '#/table-categories'
                }
            }
        } catch (e) {
            console.log(e)
        }
    }

    async edit() {
        try {
            const result = await CustomHttp.request(`${config.host}/operations/${this.optionId}`, 'PUT', this.createFormValue)
            if (result) {
                if (result.error) {
                    alert(result.message)
                }
                location.href = '#/table-categories'
            }
        } catch (e) {
            console.log(e)
        }
    }
}