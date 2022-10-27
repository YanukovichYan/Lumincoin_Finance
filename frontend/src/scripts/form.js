import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {Auth} from "../services/auth.js";

export class Form {

    constructor(page) {
        this.page = page
        this.agreeElement = document.getElementById('agree')
        this.processButton = document.getElementById('process')

        if (localStorage.getItem(Auth.accessTokenKey)) {
            location.href = '#/main'
            return
        }

        this.fields = [
            {
                name: 'email',
                id: 'email',
                element: null,
                regex: /^\S+@\S+\.[a-zA-Z]+$/,
                valid: false
            },
            {
                name: 'password',
                id: 'password',
                element: null,
                regex: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                valid: false
            },
        ];

        if (this.page === "signup") {
            this.fields.unshift(
                {
                    name: 'name',
                    id: 'name',
                    element: null,
                    regex: /^[А-ЯA-Z][а-яa-z]+\s*$/,
                    valid: false
                }
            )
            this.fields.push(
                {
                    name: 'password-repeat',
                    id: 'password-repeat',
                    element: null,
                    regex: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                    valid: false
                }
            )
        }

        document.getElementById('eye').onclick = () => {
            viewPassword()
        }
        function viewPassword() {
            let inputPassword = document.getElementById("password");
            if (inputPassword.getAttribute('type') === 'password') {
                inputPassword.setAttribute('type', 'text')
            } else {
                inputPassword.setAttribute('type', 'password')
            }

            setTimeout(() => {
                inputPassword.setAttribute('type', 'password')
            }, 1900)
        }

        const that = this;

        this.fields.forEach(item => {
            item.element = document.getElementById(item.id)

            item.element.onchange = function () {
                that.validateField.call(that, item, this)
                // console.log("that", that)
                // console.log("item", item)
                // console.log("this", this)
            }
        })

        this.processButton.onclick = function () {
            that.processSignup()
        }

        if (page === 'signup') {
            this.agreeElement.onchange = function () {
                that.validateForm()
            }
        }
    }

    validateField(field, element) {
        if (!element.value || !element.value.match(field.regex)) {
            console.log('RED')
            element.style.borderColor = 'red'
            field.valid = false
        } else {
            console.log("GREEN")
            element.style.borderColor = '#ced4da'
            field.valid = true
        }
        this.validateForm()
    }

    validateForm() {
        const validForm = this.fields.every((item) => item.valid)

        const isValid = this.agreeElement ? this.agreeElement.checked && validForm : validForm
        if (isValid) {
            this.processButton.removeAttribute('disabled')
        } else {
            this.processButton.setAttribute('disabled', 'disabled')
        }
        return isValid
    }

    async processSignup() {

        const email = this.fields.find(item => item.name === 'email').element.value
        const password = this.fields.find(item => item.name === 'password').element.value

        if (this.page === 'signup') {
            try {
                const result = await CustomHttp.request(`${config.host}/signup`, 'POST', {
                    name: this.fields.find(item => item.name === 'name').element.value,
                    lastName: "lastName",
                    email: email,
                    password: password,
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
                        window.location.href = "#/main"
                    }
                }
            } catch (e) {
                console.log("123", e)
            }
        }
        try {
            const result = await CustomHttp.request(`${config.host}/login`, 'POST', {
                email: email,
                password: password,
                rememberMe: false
            })

            if (result) {
                if (result.error) {
                    alert(result.message)
                    throw new Error(result.message)
                }
                Auth.setTokens(result.tokens.accessToken, result.tokens.refreshToken)
                Auth.setUserInfo(result.user)
                alert("Вы успешно вошли в аккаунт!")
                location.href = '#/main'
            }

        } catch (e) {
            console.log(e)
        }


    }
}