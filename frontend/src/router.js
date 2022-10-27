import {Income} from "./scripts/income.js";
import {Form} from "./scripts/form.js";
import {Auth} from "./services/auth.js";
import {Edit} from "./scripts/edit.js";

export class Router {
    constructor() {
        this.contentElement = document.getElementById('content')
        this.pageTitleElement = document.getElementById('page-title')
        this.mainTitleElement = document.getElementById('main-title')
        this.profileElement = document.getElementById('profile')
        this.profileNameElement = document.getElementById('profile-name')


        this.routes = [
            {
                route: '#/signup',
                title: 'Регистрация',
                template: 'templates/auth/signup.html',
                load: () => {
                    new Form('signup');
                }
            },
            {
                route: '#/login',
                title: 'Вход в систему',
                template: 'templates/auth/login.html',
                load: () => {
                    new Form('login');
                }
            },
            {
                route: '#/',
                title: 'Главная',
                template: 'templates/main.html',
                load: () => {
                    // new Main()
                }
            },
            {
                route: '#/income',
                title: 'Доходы',
                template: 'templates/income.html',
                load: () => {
                    new Income('income');
                }
            },
            {
                route: '#/create-income',
                title: 'Создание категории доходов',
                template: 'templates/createIncome.html',
                load: () => {
                    new Income('create-income');
                }
            },
            {
                route: '#/edit-income',
                title: 'Редактирование категории доходов',
                template: 'templates/editIncome.html',
                load: () => {
                    new Edit('income');
                }
            },
            {
                route: '#/expense',
                title: 'Расходы',
                template: 'templates/income.html',
                load: () => {
                    new Income('expense');
                }
            },
            {
                route: '#/create-expense',
                title: 'Создание категории расходов',
                template: 'templates/createIncome.html',
                load: () => {
                    new Income('create-expense');
                }
            },
            {
                route: '#/edit-expense',
                title: 'Редактирование категории расходов',
                template: 'templates/editIncome.html',
                load: () => {
                    new Edit('expense');
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

        // console.log(localStorage.getItem(Auth.accessTokenKey))



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