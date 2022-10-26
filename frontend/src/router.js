import {Income} from "./scripts/income.js";
import {Login} from "./scripts/login.js";
import {Form} from "./scripts/form.js";

export class Router {
    constructor() {
        this.contentElement = document.getElementById('content')
        // this.stylesElement = document.getElementById('styles')
        this.pageTitleElement = document.getElementById('page-title')
        this.mainTitleElement = document.getElementById('main-title')
        this.profileElement = document.getElementById('profile')
        this.profileFullNameElement = document.getElementById('profile-full-name')


        this.routes = [
            {
                route: '#/',
                title: 'Главная',
                template: 'templates/main.html',
                load: () => {
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
                // styles: 'styles/test.css',
                load: () => {
                    // new Test();
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
                // styles: 'styles/right-answers.css',
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
        //
        // if (urlRoute === '#/logout') {
        //    await Auth.logout()
        //     window.location.href = '#/'
        //     return
        // }
        //
        const newRoute = this.routes.find(item => {
            return item.route === urlRoute
        });




        if (!newRoute) {
            window.location.href = '#/'
            return
        }


        this.contentElement.innerHTML =
            await fetch(newRoute.template).then(response => response.text())

        // this.stylesElement.setAttribute('href', newRoute.styles)

        // const userInfo = Auth.getUserInfo()
        // const accessInfo = localStorage.getItem(Auth.accessTokenKey)
        // if (userInfo && accessInfo) {
        //     this.profileElement.style.display = 'flex'
        //     this.profileFullNameElement.innerText = userInfo.fullName
        // } else {
        //     this.profileElement.style.display = 'none '
        // }
        //

        newRoute.load()

        this.pageTitleElement.innerText = newRoute.title


        this.mainTitleElement.innerText = newRoute.title

        if (urlRoute === '#/login' || urlRoute === '#/signup') {
            document.getElementById('sidebar').style.cssText = 'display:none!important'
            document.getElementById('wrapper').style.cssText = 'display:block!important'
            document.getElementById('wrapper-content').style.cssText = `margin:0!important; padding:0!important`
            this.mainTitleElement.style.cssText = 'display:none!important'
        }


    }
}