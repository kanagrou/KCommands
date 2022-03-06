import * as path from 'path';
import * as fs from 'fs';
import { Client } from 'discord.js';
import KEvent from './event';

interface IEventManager {
    dir: string,
}

export default class EventManager {

    client: Client;
    dir: string;
    events: KEvent[];

    constructor(client: Client, {dir}: IEventManager)
    {
        this.client = client;
        this.dir = dir;
        this.events = [];

        this.client.on('ready', async () => this.#readyHandler());
    }

    async loadExtension(name: string): Promise<void>
    {
        const event = (await import(path.join(this.dir, name))).default as KEvent;
        this.client.on(event.event, event.listener);
    }

    async #readyHandler() {
        const commandFiles = fs.readdirSync(this.dir);

        for (const file of commandFiles)
            await this.loadExtension(file);
    }
}