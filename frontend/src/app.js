import {Router} from './router.js'
import {CustomHttp} from "./services/custom-http.js";
import config from "../config/config.js";
import {Auth} from "./services/auth.js";

class App {
    constructor() {
        this.router = new Router();
        window.addEventListener('DOMContentLoaded', this.handleRouteChanging.bind(this));
        window.addEventListener('popstate', this.handleRouteChanging.bind(this));
    }

    handleRouteChanging() {
        this.router.openRoute();
        this.getBalance()
    }

    async getBalance() {

        // if (localStorage.getItem(Auth.accessTokenKey) === null) {
        //     location.href = '#/login'
        // }

        if (localStorage.getItem(Auth.accessTokenKey)) {

            try {
                const result = await CustomHttp.request(`${config.host}/balance`)
                document.getElementById('balance').innerText = `${result.balance}$`
            } catch (e) {
                console.log(e)
            }
        }
    }
}


(new App());