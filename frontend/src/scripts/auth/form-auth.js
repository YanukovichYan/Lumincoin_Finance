import {CustomHttp} from "../../../services/custom-http.js";
import config from "../../../config/config.js";
import {Auth} from "../../../services/auth.js";

export class FormAuth {

    constructor(page) {
        this.page = page
        this.agreeElement = document.getElementById('agree')
        this.processButton = document.getElementById('process')
        this.remember = document.getElementById('remember')

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
                    regex: /^[А-ЯA-Z][а-яa-z]+\s*[А-ЯA-Z][а-яa-z]+\s*[А-ЯA-Z][а-яa-z]+\s*$/,
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
            element.style.borderColor = 'red'
            field.valid = false
        } else {
            element.style.borderColor = '#ced4da'
            field.valid = true
        }

        this.validateForm()
    }

    validateForm() {
        const validForm = this.fields.every((item) => item.valid)
        let passwordRepeat = null

        const password = this.fields.find(item => item.name === 'password').element.value
        if (this.page === 'signup') {
            passwordRepeat = this.fields.find(item => item.name === 'password-repeat').element.value
        }

        const isValid = this.agreeElement ? this.agreeElement.checked && validForm : validForm

        if (isValid) {
            this.processButton.removeAttribute('disabled')
        } else {
            this.processButton.setAttribute('disabled', 'disabled')
        }

        if (password && passwordRepeat) {
            if (password === passwordRepeat) {
                return isValid
            } else {
                alert('Пароли не совпадают')
            }
        }
    }

    async processSignup() {

        const email = this.fields.find(item => item.name === 'email').element.value
        const password = this.fields.find(item => item.name === 'password').element.value

        if (this.page === 'signup') {
            const fio = this.fields.find(item => item.name === 'name').element.value
            const arrFio = fio.split(' ')
            try {
                const result = await CustomHttp.request(`${config.host}/signup`, 'POST', {
                    name: arrFio[1],
                    lastName: arrFio[0],
                    email: email,
                    password: password,
                    passwordRepeat: this.fields.find(item => item.name === 'password-repeat').element.value
                })

                if (result) {
                    if (result.error) {
                        console.log(result.message)
                        if (result.validation[0].message) {
                            console.log(result.validation[0].message)
                        }
                        throw new Error(result.message)
                    } else if (result.user) {
                        console.log('Registration completed successfully')
                        window.location.href = "#/main"
                    }
                }
            } catch (e) {
                console.log("Ошибка signup")
                return
            }
        }
        try {
            const result = await CustomHttp.request(`${config.host}/login`, 'POST', {
                email: email,
                password: password,
                rememberMe: this.remember?.checked || false
            })

            if (result) {
                if (result.error) {
                    console.log(result.message)
                    throw new Error(result.message)
                }
                Auth.setTokens(result.tokens.accessToken, result.tokens.refreshToken)
                Auth.setUserInfo(result.user)
                console.log("Вы успешно вошли в аккаунт!")
                location.href = '#/main'
            }

        } catch (e) {
            console.log(e)
        }
    }
}