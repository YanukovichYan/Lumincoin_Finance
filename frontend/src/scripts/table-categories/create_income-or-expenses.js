import {CustomHttp} from "../../../services/custom-http.js";
import config from "../../../config/config.js";

export class Create_incomeOrExpenses {

    constructor(page) {

        this.page = page
        console.log("PAGE", page)
        this.init()
    }

    init() {

        if (this.page === 'edit') {
            document.getElementById('save').innerText = 'Сохранить'
        }

        document.getElementById('cancel').onclick = () => {
            location.href = '#/table-categories'
        }

        document.getElementById('save').onclick = () => {
            this.create()
        }


    }

    async create() {

        try {

            const result = await CustomHttp.request(`${config.host}/operations`, 'POST', {
                type: "income",
                amount: 250,
                date: "2022-09-30",
                comment: "new comment",
                category_id: 3
            })
            console.log("CRESTE - result - ", result)

        } catch (e) {
            console.log(e)
        }

    }

}