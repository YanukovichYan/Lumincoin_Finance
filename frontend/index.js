import {Router} from './routes/router.js'
import {CustomHttp} from "./services/custom-http.js";
import config from "./config/config.js";
import {Auth} from "./services/auth.js";

class Index {
    constructor() {
        this.router = new Router();
        window.addEventListener('DOMContentLoaded', this.handleRouteChanging.bind(this));
        window.addEventListener('popstate', this.handleRouteChanging.bind(this));
    }

    handleRouteChanging() {
        this.router.openRoute();
        this.getBalance()
        this.activeSidebarItem()
    }

    async getBalance() {

        // if (localStorage.getItem(Auth.accessTokenKey) === null) {
        //     location.href = '#/login'
        // }

        if (localStorage.getItem(Auth.accessTokenKey)) {
            try {
                const result = await CustomHttp.request(`${config.host}/balance`)
                if (result.balance) {
                    document.getElementById('balance').innerText = `${result.balance}$`
                }
            } catch (e) {
                console.log(e)
            }
        }
    }

    activeSidebarItem() {
        let navLinks = document.querySelectorAll('[data-name="nav"]')
        const currentUrl = location.hash.split('/')[1]
        const dropdownButton = document.getElementById('dropdown-button')

        navLinks.forEach(link => {
            if (currentUrl === link.querySelector('a').getAttribute('href').split('/')[1]) {
                link.classList.add('active')
            } else {
                link.classList.remove('active')
            }

            if (currentUrl === 'income' || currentUrl === 'expense') {
                document.getElementById('dashboard-collapse').classList.add('show')
                dropdownButton.className = 'btn btn-primary w-100 rounded-top justify-content-between btn-toggle d-inline-flex align-items-center border-0'
            } else {
                document.getElementById('dashboard-collapse').classList.remove('show')
                dropdownButton.className = 'btn w-100 rounded-top justify-content-between btn-toggle d-inline-flex align-items-center border-0'
            }
        })

        dropdownButton.onclick = () => {
            dropdownButton.classList.toggle('active')
            dropdownButton.classList.toggle('rounded')

            if (document.getElementById('dashboard-collapse').classList.contains('active')) {
                dropdownButton.classList.add('active')
            }
        }
    }
}


(new Index());