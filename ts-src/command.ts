import { Client, CommandInteraction, Guild, Message, TextChannel } from 'discord.js'
import { ISlashCommand } from './slashtypes';

export type TListener = (args:IListener, options?:IListenerOptions) => Promise<void>;
type TSubListener = {[SubCommandName:string]: TListener};
type TGroupListener = {[GroupCommandName: string]: TSubListener};

interface IListener {
    client: Client,
    message?: Message,
    interaction?: CommandInteraction,
    channel: TextChannel,
    guild: Guild,
    legacyOptions: string[]
}

export interface IListenerOptions {
    [options:string]: any
}

export default interface Command {
    name: string,
    description: string,
    options?: string,
    guildOnly?: boolean,
    legacy?: boolean,
    slash?: boolean,
    restricted?: boolean,
    listener?: TListener,
    subListeners?: TSubListener,
    groupListeners?: TGroupListener,
    slashStructure?: ISlashCommand
}