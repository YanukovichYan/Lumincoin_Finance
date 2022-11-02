import {Router} from './routes/router.js'

class Index {
    constructor() {
        this.router = new Router();
        window.addEventListener('DOMContentLoaded', this.handleRouteChanging.bind(this));
        window.addEventListener('popstate', this.handleRouteChanging.bind(this));
    }

    handleRouteChanging() {
        this.router.openRoute();
        this.activeSidebarItem()
    }

    // if (localStorage.getItem(Auth.accessTokenKey) === null) {
    //     location.href = '#/login'
    // }

    activeSidebarItem() {
        let navLinks = document.querySelectorAll('[data-name="nav"]')
        const currentUrl = location.hash.split('/')[1]
        const dropdownButton = document.getElementById('dropdown-button')

        navLinks.forEach(link => {
            if (currentUrl === link.querySelector('a').getAttribute('href').split('/')[1]) {
                link.classList.add('active')
                dropdownButton.classList.remove('active')
            } else {
                link.classList.remove('active')
            }

            if (currentUrl === 'income' || currentUrl === 'expense') {
                document.getElementById('dashboard-collapse').classList.add('show')
                dropdownButton.classList.add('btn-primary')
            } else {
                document.getElementById('dashboard-collapse').classList.remove('show')
                dropdownButton.classList.remove('btn-primary')
            }
        })

        dropdownButton.onclick = () => {
            dropdownButton.classList.toggle('active')
            dropdownButton.classList.toggle('rounded')

            if (document.getElementById('dashboard-collapse').classList.contains('active')) dropdownButton.classList.add('active')
        }
    }
}

(new Index());