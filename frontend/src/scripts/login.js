import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class Login {

    constructor() {
        this.validateForm()
    }


    validateForm() {
        console.log('Login-page')
        const that = this
        document.getElementById('process-login').onclick = function () {
            that.processSignup()
        }
    }

    async processSignup() {
        console.log("CLICK-login")

        try {
            const result = await CustomHttp.request(`${config.host}/login`, 'POST', {
                email: "dassdfdfds@itlogia.ru",
                password: "12345678Qq",
                rememberMe: false
            })

            console.log(result)

        } catch (e) {
            console.log("123", e)
        }

    }

}