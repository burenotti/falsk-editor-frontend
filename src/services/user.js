export default class User {
    constructor(accessToken, username, avatarURL) {
        this._accessToken = accessToken;
        this.username = username;
        this.avatarURL = avatarURL;
    }

    get accessToken() {
        return this._accessToken;
    }

    set accessToken(newToken) {
        this._accessToken = newToken;
        localStorage.setItem("accessToken", this.accessToken);
    }

    get isAuthorized() {
        return !!this.accessToken;
    }

    dumpToLocalStorage() {
        const json = JSON.stringify({
            accessToken: this.accessToken,
            username: this.username,
            avatarURL: this.avatarURL,
        });
        localStorage.setItem("currentUser", json);
    }

    static loadFromLocalstorage() {
        const raw_user = localStorage.getItem("currentUser");
        const data = JSON.parse(raw_user ?? "{}");
        return new User(data.accessToken, data.username, data.avatarURL);
    }

    static fromJWT(token) {
        const content = JSON.parse(atob(token.split('.')[1]));
        return new User(token, content.username, content.avatar_url);
    }
}