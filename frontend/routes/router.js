import {Category} from "../src/scripts/incomes-and-expenses/category.js";
import {Form} from "../src/scripts/form.js";
import {Auth} from "../services/auth.js";
import {Edit} from "../src/scripts/incomes-and-expenses/edit.js";
import {TableCategories} from "../src/scripts/table-categories/table-categories.js";
import {Create_incomeOrExpenses} from "../src/scripts/table-categories/create_income-or-expenses.js";

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
                template: 'src/templates/auth/signup.html',
                load: () => {
                    new Form('signup');
                }
            },
            {
                route: '#/login',
                title: 'Вход в систему',
                template: 'src/templates/auth/login.html',
                load: () => {
                    new Form('login');
                }
            },
            {
                route: '#/',
                title: 'Главная',
                template: 'src/templates/main/main.html',
                load: () => {
                    // new Main()
                }
            },
            {
                route: '#/income',
                title: 'Доходы',
                template: 'src/templates/incomes-and-expenses/category.html',
                load: () => {
                    new Category('income');
                }
            },
            {
                route: '#/create-income',
                title: 'Создание категории доходов',
                template: 'src/templates/incomes-and-expenses/create-category.html',
                load: () => {
                    new Category('create-income');
                }
            },
            {
                route: '#/edit-income',
                title: 'Редактирование категории доходов',
                template: 'src/templates/incomes-and-expenses/edit-category.html',
                load: () => {
                    new Edit('income');
                }
            },
            {
                route: '#/expense',
                title: 'Расходы',
                template: 'src/templates/incomes-and-expenses/category.html',
                load: () => {
                    new Category('expense');
                }
            },
            {
                route: '#/create-expense',
                title: 'Создание категории расходов',
                template: 'src/templates/incomes-and-expenses/create-category.html',
                load: () => {
                    new Category('create-expense');
                }
            },
            {
                route: '#/edit-expense',
                title: 'Редактирование категории расходов',
                template: 'src/templates/incomes-and-expenses/edit-category.html',
                load: () => {
                    new Edit('expense');
                }
            },
            {
                route: '#/table-categories',
                title: 'Доходы и расходы',
                template: 'src/templates/table-categories/table-categories.html',
                load: () => {
                    new TableCategories();
                }
            },
            {
                route: '#/create_income-or-expenses',
                title: 'Создание дохода/расхода',
                template: 'src/templates/table-categories/create_income-or-expenses.html',
                load: () => {
                    new Create_incomeOrExpenses('create');
                }
            },
            {
                route: '#/edit_income-or-expense',
                title: 'Редактирование дохода/расхода',
                template: 'src/templates/table-categories/create_income-or-expenses.html',
                load: () => {
                    new Create_incomeOrExpenses('edit');
                }
            },
        ]
    }


    async openRoute() {
        const urlRoute = window.location.hash.split('?')[0]

        let accessTokenKey = localStorage.getItem(Auth.accessTokenKey)

        if (accessTokenKey === null && urlRoute !== '#/login' && urlRoute !== '#/signup') {
            alert('Нет токенов, необходимо войти или зарегистрироваться')
            window.location.href = '#/login'
            return
        }

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