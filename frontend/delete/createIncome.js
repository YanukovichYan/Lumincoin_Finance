import {CustomHttp} from "../src/services/custom-http.js";
import config from "../config/config.js";

export class CreateIncome {

    // constructor() {
    //
    //     this.createButton = document.getElementById('create-button')
    //     this.createInput = document.getElementById('create-input')
    //
    //     this.createButton.onclick = () => {
    //         this.createInput.value
    //         this.createIncome()
    //     }
    // }
    //
    // async createIncome() {
    //     try {
    //         const result = await CustomHttp.request(`${config.host}/categories/income`, "POST", {
    //             title: this.createInput.value
    //         })
    //         if (result) {
    //             if (result.error) {
    //                 alert(result.message)
    //                 throw new Error(result.message)
    //             }
    //             console.log(result)
    //             location.href = '#/income'
    //
    //         }
    //     } catch (e) {
    //         console.log(e)
    //     }
    // }
}
