export default class BulbService {
    constructor(url = null) {
        this.baseUrl = new URL("/", url ?? process.env.BULB_API_URL);
    }

    buildURL(methodName, params) {
        let url = new URL(methodName, this.baseUrl);
        Object
            .entries(params)
            .filter(([key, value]) => value !== null)
            .forEach(([key, value]) => url.searchParams.set(key, value));

        return url;
    }

    async apiCall(url, method, json = null) {
        const encodedUrl = encodeURI(url.toString());
        console.log(`Sending ${method} request to ${encodedUrl}`)

        return await fetch(encodedUrl, {
            method: method,
            body: json ? JSON.stringify(json) : null,
        });
    }

    async callMethod(methodName, methodType, params = {}, json = null) {
        const url = this.buildURL(methodName, params);
        return await this.apiCall(url, methodType, json)
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
            langVer,
            code: code,
        })
        return new SandboxProxy(ws)
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
        this.onOutputMessage = async (_) => {};
        this.onFinishMessage = async (_) => {};
        this.onErrorMessage = async (_) => {};
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