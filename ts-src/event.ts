import { ClientEvents } from 'discord.js'

export type TListener = (...args:any) => Promise<void>;

interface IListener {
}

export default interface Event {
    event: keyof ClientEvents,
    guild?: string,
    listener: TListener,
}