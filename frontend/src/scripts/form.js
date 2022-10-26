import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class Form {

    constructor(page) {
        this.page = page

        this.fields = [
            {
                name: 'name',
                id: 'name',
                element: null,
                // regex: /^[А-ЯA-Z][а-яa-z]+\s*$/,
                valid: false
            },
            {
                name: 'email',
                id: 'email',
                element: null,
                // regex: /^\S+@\S+\.[a-zA-Z]+$/,
                valid: false
            },
            {
                name: 'password',
                id: 'password',
                element: null,
                // regex: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                valid: false
            },

            {
                name: 'password-repeat',
                id: 'password-repeat',
                element: null,
                // regex: /^[А-ЯA-Z][а-яa-z]+\s*$/,
                valid: false
            },
        ];

        this.fields.forEach(item => {
            console.log(item)
            item.element = document.getElementById(item.id)
        })

        this.validateForm()
    }


    validateForm() {
        const that = this
        console.log('Signup-page')
        console.log("validateForm", this)
        document.getElementById('process-signup').onclick = function () {
            that.processSignup()
        }

    }

    async processSignup() {
        console.log("READY processSignup")

        try {
            const result = await CustomHttp.request(`${config.host}/signup`, 'POST', {
                name: this.fields.find(item => item.name === 'name').element.value,
                lastName: "Айтилогии",
                email: this.fields.find(item => item.name === 'email').element.value,
                password: this.fields.find(item => item.name === 'password').element.value,
                passwordRepeat: this.fields.find(item => item.name === 'password-repeat').element.value
            })

            if (result) {
                if (result.error) {
                    alert(result.message)
                    if (result.validation[0].message) {
                        alert(result.validation[0].message)
                    }
                    throw new Error(result.message)
                } else if (result.user) {
                    alert('Registration completed successfully')
                    window.location.href = "#/login"
                }
            }
            console.log(result)

        } catch (e) {
            console.log("123", e)
        }

    }

}