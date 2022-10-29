import {CustomHttp} from "../../../services/custom-http.js";
import config from "../../../config/config.js";

export class Create_incomeOrExpenses {

    constructor(page) {

        this.page = page
        this.categories = null
        this.createFormValue = null

        this.urlParams = window.location.href.split('=')[1]

        this.selectType = this.urlParams

        this.init()
    }

    init() {

        if (this.page === 'edit') {
            document.getElementById('save').innerText = 'Сохранить'
        }

        this.fillingForm()

    }

    fillingForm() {

        this.getCategories()

        const selectType = document.getElementById('select-type')

        this.urlParams === 'income' ? selectType.selectedIndex = 1 : selectType.selectedIndex = 2

        document.getElementById('select-type').onchange = () => {
            document.getElementById('select-category').innerHTML = ' '
            this.selectType = selectType.value
            this.getCategories()
        }

        document.getElementById('form').onchange = () => {

            this.selectType = selectType.value

            this.createFormValue = {
                type: selectType.value,
                amount: document.getElementById('amount').value,
                date: document.getElementById('date').value,
                comment: document.getElementById('comment').value,
                category_id: +(document.getElementById('select-category').value),
            }

            console.log(this.createFormValue)
        }

        document.getElementById('save').onclick = () => {
            this.create()
        }

        document.getElementById('cancel').onclick = () => {
            location.href = '#/table-categories'
        }

    }

    async getCategories() {

        try {
            const result = await CustomHttp.request(`${config.host}/categories/${this.selectType}`)

            if (result) {
                this.categories = result
                // console.log("this.categories", this.categories)
                if (result.length === 0) {
                    alert('Категорий нет!')
                }
                // console.log("CATEGORY", result)
            }
        } catch (e) {
            console.log(e)
        }

        this.showCategoryOptions()

    }

    showCategoryOptions() {

        if (this.categories) {

            const defaultOption = document.createElement('option')
            defaultOption.innerText = 'Категория...'
            // defaultOption.setAttribute('disabled', 'disabled')
            defaultOption.setAttribute('hidden', 'hidden')
            defaultOption.setAttribute('selected', 'selected')

            document.getElementById('select-category').appendChild(defaultOption)

            this.categories.forEach(option => {

                const optionCategory = document.createElement('option')
                optionCategory.innerText = option.title
                optionCategory.value = option.id


                document.getElementById('select-category').appendChild(optionCategory)
            })

        }

    }

    async create() {

        try {
            const result = await CustomHttp.request(`${config.host}/operations`, 'POST', this.createFormValue)

            if (result) {
                if (result.error) {
                    alert(result.message)
                }
            }
            console.log("CREATE-result", result)
        } catch (e) {
            console.log(e)
        }
    }

}