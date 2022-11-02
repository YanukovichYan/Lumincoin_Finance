import {CustomHttp} from "../../services/custom-http.js";
import {Auth} from "../../services/auth.js";
import config from "../../config/config.js";

export class Sidebar {

    static async getBalance() {
        if (localStorage.getItem(Auth.accessTokenKey)) {
            try {
                const result = await CustomHttp.request(`${config.host}/balance`)
                document.getElementById('balance').innerText = `${result.balance}$`
                if(result) {
                    return result.balance
                }
            } catch (e) {
                console.log(e)
            }
        }
    }

    static async updateBalance(newBalance) {

        if (localStorage.getItem(Auth.accessTokenKey)) {
            try {
                const result = await CustomHttp.request(`${config.host}/balance`, 'PUT', {
                    newBalance: newBalance
                })
                document.getElementById('balance').innerText = `${result.balance}$`
            } catch (e) {
                console.log(e)
            }
        }
    }
}

