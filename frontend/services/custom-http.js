import {Auth} from "./auth.js";

export class CustomHttp {
    static async request(url, method = 'GET', body = null) {

        const params = {
            method: method,
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            }
        }

        let token = localStorage.getItem(Auth.accessTokenKey)

        if (token) params.headers['x-auth-token'] = token

        if (body) params.body = JSON.stringify(body)

        const response = await fetch(url, params)

        if (response.status < 200 || response.status >= 300) {
            // console.log("response", response)
            if (response) {
                if (response.statusText) {
                    console.log(response.statusText)
                }
            }
            if (response.status === 401) {
                // console.log("HERE")
                const result = await Auth.refresh()
                // console.log('result-refresh', result)
                if (result) {
                    return await this.request(url, method, body)
                } else {
                    return null
                }
            }
            if (response.message) {
                console.log(response.message)
            }
            // throw new Error(response.message)
        }
        return await response.json()
    }
}