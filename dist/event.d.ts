import { ClientEvents } from 'discord.js';
export declare type TListener = (...args: any) => Promise<void>;
export default interface Event {
    event: keyof ClientEvents;
    guild?: string;
    listener: TListener;
}
