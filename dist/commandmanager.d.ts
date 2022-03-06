/// <reference types="node" />
import { Client } from 'discord.js';
import KCommand from './command';
import { EventEmitter } from 'events';
import SlashCommandManager from './slashapi';
interface ICommandManager {
    dir: string;
    prefix: string;
    guild?: string;
    owners: string[];
    noUpdates: boolean;
}
export default class CommandManager {
    #private;
    client: Client;
    emitter: EventEmitter;
    dir: string;
    prefix: string;
    testGuildId?: string;
    owners?: string[];
    noUpdates?: boolean;
    slashCommandManager: SlashCommandManager;
    commands: KCommand[];
    constructor(client: Client, { dir, prefix, guild, owners, noUpdates }: ICommandManager);
    loadExtension(name: string): Promise<void>;
}
export {};
