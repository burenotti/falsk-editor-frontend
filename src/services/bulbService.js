export default class BulbService {
    constructor(url = null) {
        this.baseUrl = new URL("/", url ?? process.env.REACT_APP_BULB_API_URL);
    }

    static buildFormBody = (form) => encodeURI(
        new URLSearchParams(Object.entries(form)).toString()
    );

    buildURL(methodName, params) {
        let url = new URL(methodName, this.baseUrl);
        Object
            .entries(params)
            .filter(([, value]) => value !== null)
            .forEach(([key, value]) => url.searchParams.set(key, value));

        return url;
    }

    async apiCall({url, method, json = null, form = null, token = null}) {
        const encodedUrl = encodeURI(url.toString());
        console.log(`Sending ${method} request to ${encodedUrl}`)

        let headers = {
            Accept: "application/json",
        };

        let body = null;

        if (form && json)
            throw Error("Specify either form or json parameters, not both.")

        if (json) {
            headers["Content-Type"] = "application/json";
            body = JSON.stringify(json);
        }
        if (form) {
            headers["Content-Type"] = "application/x-www-form-urlencoded"
            body = new URLSearchParams(Object.entries(form)).toString();
        }

        if (token)
            headers["Authorization"] = `bearer ${token}`;

        return await fetch(encodedUrl, {
            method: method,
            body: body,
            headers: headers,
        });
    }

    async callMethod(methodName, methodType,
                     {params = {}, json = null, token = null}) {
        const url = this.buildURL(methodName, params);
        const response = await this.apiCall({
            url: url,
            method: methodType,
            json: json,
            token: token,
        });

        if (!response.ok)
            throw response;

        return await response.json();
    }


    callWebsocket(methodName, params) {
        let url = this.buildURL(methodName, params);
        url.protocol = "ws";
        console.log(`Creating websocket on ${url}`)
        return new WebSocket(url);
    }

    async getStats() {
        return await this.callMethod("code/stats", "GET", {})
    }

    async getSupportedLanguages() {
        const stats = await this.getStats();
        return stats["available_languages"] ?? []
    }


    async runCode(lang, code, langVer = null) {
        const ws = this.callWebsocket("code/run", {
            language: lang,
            version: langVer,
            code: code,
        })
        return new SandboxProxy(ws)
    }

    async getToken(code) {
        const token = await this.callMethod("oauth/github/token", "POST", {})
        return token["access_token"] ?? null;
    }

    async getSnippet(username, snippet, token = null) {
        const method = `snippet/${username}/name/${snippet}`
        return await this.callMethod(method, "GET", {token: token});
    }

    async patchSnippet(author, snippetName, patch, token) {
        const method = `snippet/${author}/name/${snippetName}`
        return await this.callMethod(method, "PATCH", {
            json: patch,
            token: token,
        });
    }

    async getSnippetsList(username, token = null) {
        const method = `snippet/${username}/list`
        return await this.callMethod(method, "GET", {token: token});
    }
};

class SandboxProxy {
    constructor(websocket) {
        websocket.addEventListener('message', this.onMessage);
        this.openPromise = new Promise((resolve, reject) => {
            websocket.onopen = () => {
                resolve();
            }
            websocket.onerror = reject;
        });
        this.websocket = websocket;
        this.result = null;
        this.ready = false;
        this.onOutputMessage = async (_) => {
        };
        this.onFinishMessage = async (_) => {
        };
        this.onErrorMessage = async (_) => {
        };
    }

    open = async () => {
        if (!this.ready) {
            await this.openPromise;
            this.ready = true;
        }
    }

    onMessage = async (event) => {
        const message = JSON.parse(event.data);
        console.log(message);
        await this.handleMessage(message);
    }

    handleMessage = async (message) => {
        const handlers = {
            "output_message": this.onOutputMessage,
            "error": this.onErrorMessage,
            "finish": this.onFinishMessage,
        }
        const handler = handlers[message.message_type];
        return handler(message);
    }

    async sendInput(input) {
        await this.open();
        this.websocket.send(JSON.stringify({
            message_type: "input_message",
            data: input,
        }));
    }

    async terminate() {
        await this.open();
        this.websocket.send(JSON.stringify({
            message_type: "terminate_message",
        }))
    }

}