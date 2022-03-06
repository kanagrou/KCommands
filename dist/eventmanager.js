"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
class EventManager {
    client;
    dir;
    events;
    constructor(client, { dir }) {
        this.client = client;
        this.dir = dir;
        this.events = [];
        this.client.on('ready', async () => this.#readyHandler());
    }
    async loadExtension(name) {
        const event = (await Promise.resolve().then(() => require(path.join(this.dir, name)))).default;
        this.client.on(event.event, event.listener);
    }
    async #readyHandler() {
        const commandFiles = fs.readdirSync(this.dir);
        for (const file of commandFiles)
            await this.loadExtension(file);
    }
}
exports.default = EventManager;
