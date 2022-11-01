import config from "../config/config.js";

export class Auth {

    static accessTokenKey = 'accessToken'
    static refreshTokenKey = 'refreshToken'
    static userInfoKey = 'userInfo'

    static setTokens(accessToken, refreshToken) {
        localStorage.setItem(this.accessTokenKey, accessToken)
        localStorage.setItem(this.refreshTokenKey, refreshToken)
    }

    static removeTokens() {
        localStorage.removeItem(this.accessTokenKey)
        localStorage.removeItem(this.refreshTokenKey)
    }

    static setUserInfo(user) {
        localStorage.setItem(this.userInfoKey, JSON.stringify(user))
    }

    static getUserInfo() {
        const userInfo = localStorage.getItem(this.userInfoKey)
        return userInfo ? JSON.parse(userInfo) : null
    }

    static async logout() {
        const response = await fetch(`${config.host}/logout`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({refreshToken: localStorage.getItem(this.refreshTokenKey)})
        })

        if (response && response.status === 200) {
            const result = await response.json()
            if (result && !result.error) {
                alert("Вы вышли из аккаунта")
                this.removeTokens()
                localStorage.removeItem(Auth.userInfoKey)
                return true
            }
        }
    }

    static async refresh() {
        const refreshToken = localStorage.getItem(this.refreshTokenKey)

        if (refreshToken) {
            const response = await fetch(`${config.host}/refresh`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({refreshToken: refreshToken})
            })

            if (response && response.status === 200) {
                const result = await response.json()
                // console.log(result)
                if (result) {
                    // console.log("Записываю в localStorage", result)
                    this.setTokens(result.tokens.accessToken, result.tokens.refreshToken)
                    return true
                }
            }
        }
        localStorage.removeItem(this.userInfoKey)
        this.removeTokens()
        location.href = '#/login'
        return false
    }
}