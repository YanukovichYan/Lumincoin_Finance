import {CustomHttp} from "../../../services/custom-http.js";
import config from "../../../config/config.js";

export class TableCategories {

    constructor() {

        this.filter = "all"
        this.dataTable = null

        this.init()
    }

    init() {

        document.getElementById('create-income').onclick = () => {
            location.href = '#/create_income-or-expenses'
        }

        document.getElementById('create-expense').onclick = () => {
            location.href = '#/create_income-or-expenses'
        }

        document.getElementById('pen').onclick = () => {
            location.href = '#/edit_income-or-expense'
        }


        this.getDataTable()
        this.showFilterBtn()
        this.showTable()
    }

    async getDataTable() {

        try {

            const result = await CustomHttp.request(`${config.host}/operations?period=${this.filter}`)

            if (result) {
                this.dataTable = result

                console.log("Все операции для таблички", result)

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
            document.getElementById('thead').appendChild(title)
        })

        // if (this.dataTable) {
            console.log('111', this.dataTable)
        // }

    }


}