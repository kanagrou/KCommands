import { Client } from 'discord.js';
import KEvent from './event';
interface IEventManager {
    dir: string;
}
export default class EventManager {
    #private;
    client: Client;
    dir: string;
    events: KEvent[];
    constructor(client: Client, { dir }: IEventManager);
    loadExtension(name: string): Promise<void>;
}
export {};
