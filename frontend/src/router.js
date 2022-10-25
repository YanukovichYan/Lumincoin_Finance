// import {Form} from "./components/form.js";
// import {Choice} from "./components/choice.js";
// import {Test} from "./components/test.js";
// import {Result} from "./components/result.js";
// import {Auth} from "./services/auth.js";
// import {RightAnswers} from "./components/right-answers.js"

export class Router {
    constructor() {
        this.contentElement = document.getElementById('content')
        // this.stylesElement = document.getElementById('styles')
        this.titleElement = document.getElementById('page-title')
        this.profileElement = document.getElementById('profile')
        this.profileFullNameElement = document.getElementById('profile-full-name')


        this.routes = [
            {
                route: '#/',
                title: 'Главная',
                template: 'templates/main.html',
                // load: () => {
                // }
            },
            {
                route: '#/signup',
                title: 'Регистрация',
                template: 'templates/signup.html',
                // load: () => {
                //     new Form('signup');
                // }
            },
            {
                route: '#/login',
                title: 'Вход в систему',
                template: 'templates/login.html',
                // load: () => {
                //     new Form('login');
                // }
            },
            {
                route: '#/income',
                title: 'Доходы',
                template: 'templates/income.html',
                load: () => {
                    // new Choice();
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
            // {
            //     route: '#/result',
            //     title: 'Результаты',
            //     template: 'templates/result.html',
            //     styles: 'styles/result.css',
            //     load: () => {
            //         new Result();
            //     }
            // },
            // {
            //     route: '#/right',
            //     title: 'Результат прохождения теста',
            //     template: 'templates/right-answers.html',
            //     styles: 'styles/right-answers.css',
            //     load: () => {
            //         new RightAnswers();
            //     }
            // },
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

        if (urlRoute === '#/login') {
            document.getElementById('sidebar').style.cssText = 'display:none!important'
        }

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

        // newRoute.load()

        this.titleElement.innerText = newRoute.title
    }
}