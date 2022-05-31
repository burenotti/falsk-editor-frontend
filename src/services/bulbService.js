export default class BulbService {
    constructor(url = null) {
        this.baseUrl = new URL("/", url ?? process.env.REACT_APP_BULB_API_URL);
    }

    buildURL(methodName, params) {
        let url = new URL(methodName, this.baseUrl);
        Object
            .entries(params)
            .filter(([key, value]) => value !== null)
            .forEach(([key, value]) => url.searchParams.set(key, value));

        return url;
    }

    async apiCall(url, method, json = null, token = null) {
        const encodedUrl = encodeURI(url.toString());
        console.log(`Sending ${method} request to ${encodedUrl}`)

        let headers = {
            Accept: "application/json",
        };

        if (json) {
            headers["Content-Type"] = "application/json";
        }
        if (token)
            headers["Authorization"] = `bearer ${token}`;

        return await fetch(encodedUrl, {
            method: method,
            body: json ? JSON.stringify(json) : null,
            headers: headers,
        });
    }

    async callMethod(methodName, methodType, params = {}, json = null, token = null) {
        const url = this.buildURL(methodName, params);
        return await this.apiCall(url, methodType, json, token);
    }

    callWebsocket(methodName, params) {
        let url = this.buildURL(methodName, params);
        url.protocol = "ws";
        console.log(`Creating websocket on ${url}`)
        return new WebSocket(url);
    }

    async getStats() {
        const response = await this.callMethod("code/stats", "GET");
        if (response.ok)
            return await response.json()
        else
            throw response;
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
        const url = encodeURI(this.buildURL("oauth/github/token", {}).toString());
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            method: "POST",
            body: `code=${code}`,
        })
        const data = await response.json();
        return data["access_token"] ?? null;
    }

    async getSnippet(username, snippet, token = null) {
        console.log(`snippet/${username}/name/${snippet}`)
        const result = await this.callMethod(`snippet/${username}/name/${snippet}`,
            "GET", {}, null, token);
        return await result.json();
    }

    async patchSnippet(author, snippetName, patch, token) {
        const method = `snippet/${author}/name/${snippetName}`
        const result = await this.callMethod(method, "PATCH", {}, patch, token);
        return await result.json();
    }

    async getSnippetsList(username, token = null) {
        const result = await this.callMethod(
            `snippet/${username}/list`, "GET", {}, null, token);
        return await result.json();
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