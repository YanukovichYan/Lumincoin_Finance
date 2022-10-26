import {Income} from "./scripts/income.js";
import {Form} from "./scripts/form.js";
import {Auth} from "./services/auth.js";
import {CreateIncome} from "./scripts/createIncome.js";

export class Router {
    constructor() {
        this.contentElement = document.getElementById('content')
        this.pageTitleElement = document.getElementById('page-title')
        this.mainTitleElement = document.getElementById('main-title')
        this.profileElement = document.getElementById('profile')
        this.profileNameElement = document.getElementById('profile-name')


        this.routes = [
            {
                route: '#/',
                title: 'Главная',
                template: 'templates/main.html',
                load: () => {
                    // new Main()
                }
            },
            {
                route: '#/signup',
                title: 'Регистрация',
                template: 'templates/signup.html',
                load: () => {
                    new Form('signup');
                }
            },
            {
                route: '#/login',
                title: 'Вход в систему',
                template: 'templates/login.html',
                load: () => {
                    new Form('login');
                }
            },
            {
                route: '#/income',
                title: 'Доходы',
                template: 'templates/income.html',
                load: () => {
                    new Income();
                }
            },
            {
                route: '#/createIncome',
                title: 'Создание категории доходов',
                template: 'templates/createIncome.html',
                load: () => {
                    new CreateIncome();
                }
            },
            {
                route: '#/editIncome',
                title: 'Редактирование категории доходов',
                template: 'templates/editIncome.html',
                load: () => {
                    // new Result();
                }
            },
            {
                route: '#/expenses',
                title: 'Расходы',
                template: 'templates/expenses.html',
                load: () => {
                    // new RightAnswers();
                }
            },
            {
                route: '#/createExpenses',
                title: 'Создание категории расходов',
                template: 'templates/createExpenses.html',
                load: () => {
                    // new RightAnswers();
                }
            },
            {
                route: '#/editExpenses',
                title: 'Редактирование категории расходов',
                template: 'templates/editExpenses.html',
                load: () => {
                    // new RightAnswers();
                }
            },
            {
                route: '#/tableIncome&expenses',
                title: 'Доходы и расходы',
                template: 'templates/tableIncome&expenses.html',
                load: () => {
                    // new RightAnswers();
                }
            },
        ]
    }


    async openRoute() {
        const urlRoute = window.location.hash.split('?')[0]

        if (urlRoute === '#/logout') {
           await Auth.logout()
            window.location.href = '#/login'
            return
        }

        const newRoute = this.routes.find(item => {
            return item.route === urlRoute
        });


        if (!newRoute) {
            window.location.href = '#/'
            return
        }


        this.contentElement.innerHTML =
            await fetch(newRoute.template).then(response => response.text())

        newRoute.load()

        this.pageTitleElement.innerText = newRoute.title

        this.mainTitleElement.innerText = newRoute.title

        const userInfo = Auth.getUserInfo()
        const accessToken = localStorage.getItem(Auth.accessTokenKey)

        if (userInfo && accessToken) {
            this.profileElement.style.display = 'block'
            this.profileNameElement.innerText = userInfo.name
        } else {
            this.profileElement.style.display = 'none '
        }


        if (urlRoute === '#/login' || urlRoute === '#/signup') {
            document.getElementById('sidebar').style.cssText = 'display:none!important'
            document.getElementById('wrapper').style.cssText = 'display:block!important'
            document.getElementById('wrapper-content').style.cssText = `margin:0!important; padding:0!important`
            this.mainTitleElement.style.cssText = 'display:none!important'
        } else {
            document.getElementById('sidebar').style.cssText = 'display:flex!important'
            document.getElementById('wrapper').style.cssText = 'display:flex!important'
            document.getElementById('wrapper-content').style.cssText = `margin:unset; padding:unset`
            this.mainTitleElement.style.cssText = 'display:block!important'
        }


    }
}