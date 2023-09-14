import WebSocket from "ws";

let config;

export class Gateway {
    /**
     * Basic WSS Gateway for message relay
     * @param {Object} conf Env Var Config
     * @param {String} token User Token
     */
    constructor(conf, token) {
        config = conf;
        this.token = token;
        this.payload = {
            op: 2,
            d: {
                token: this.token,
                intents: 131071,
                properties: {
                    $os: "linux",
                    $browser: "chrome",
                    $devices: "chrome"
                }
            }
        }
    }

    /**
     * Starts the gateway
     */
    async start() {
        const resp = await fetch(`${config.API_ENDPOINT}/v10/gateway`);
        const data = await resp.json();
        let socketUrl = `${data.url}?v=10&encoding=json`;

        console.log(`Connecting to socket url ${socketUrl}`);

        this.ws = new WebSocket(socketUrl);

        this.ws.on("open", () => {
            console.log(`Socket Connected.`);

            this.send(this.payload);
        });

        this.ws.addEventListener('message', (event) => {
            const payload = event.data;
            console.log(JSON.parse(payload.toString()))
        });

        this.ws.on("message", (data) => {
            let payload = JSON.parse(data);
            const { t, event, op, d } = payload;

            switch(op){
                case 10:
                    const { heartbeat_interval } = d;
                    this.interval = this.heartbeat(heartbeat_interval);
                    break;
            }

            switch(t){
                case "READY":
                    if(t === "READY"){
                        console.log(`Bot is online`);
                    }
                break;
            }
        });
    }

    /**
     * Sends a message to the WebSocket Server
     * @param {Object} data Data to send to WebSocket Server
     */
    send(data) {
        this.ws.send(JSON.stringify(data));
    }

    /**
     * Heartbeat Method for Discord Gateway
     * @param {int} ms Heartbeat Interval
     * @returns Interval
     */
    heartbeat(ms) {
        return setInterval(() => {
            this.ws.send(JSON.stringify({ op: 1, d: null }))
        }, ms);
    }
}