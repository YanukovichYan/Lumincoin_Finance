import {CustomHttp} from "../../../services/custom-http.js";
import config from "../../../config/config.js";
import {Sidebar} from "../sidebar.js";

export class Edit {

    constructor(page) {
        this.page = page
        this.editCardId = window.location.hash.split('=')[1]
        this.editInput = document.getElementById('edit-input')
        this.newValueOnInput = null

        this.init()
    }

    async init() {
        try {
            const result = await CustomHttp.request(`${config.host}/categories/${this.page}/${this.editCardId}`)
            if (result) {
                this.editInput.value = result.title
                await Sidebar.getBalance()
            }
        } catch (e) {
            console.log(e)
        }

        this.editInput.onchange = (e) => this.newValueOnInput = e.target.value

        document.getElementById('save-edit-btn').onclick = () => this.saveEdit()

        document.getElementById('cancel-btn').onclick = () => location.href = `#/${this.page}`
    }

    async saveEdit() {
        try {
            const result = await CustomHttp.request(`${config.host}/categories/${this.page}/${this.editCardId}`, 'PUT', {
                title: this.newValueOnInput
            })
            if (result) location.href = `#/${this.page}`
                } catch (e) {
            console.log(e)
        }
    }
}