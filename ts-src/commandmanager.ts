import * as path from 'path';
import * as fs from 'fs';
import { Client, CommandInteractionOption, CommandInteractionOptionResolver, Interaction, Message, TextChannel } from 'discord.js';
import  KCommand, { IListenerOptions } from './command';
import { TListener } from './command';
import SlashCommandParser from './parser';
import { EventEmitter } from 'events';
import SlashCommandManager from './slashapi';
import { ISlashCommand } from './slashtypes';


interface ICommandManager {
    dir: string,
    prefix: string,
    guild?: string,
    owners: string[],
    noUpdates?: boolean
}

export default class CommandManager {

    client: Client;
    dir: string;
    prefix: string;
    testGuildId?: string;
    owners?: string[];
    noUpdates?: boolean;
    slashCommandManager: SlashCommandManager;
    commands: KCommand[];
    

    constructor(client: Client, {dir, prefix, guild, owners, noUpdates}: ICommandManager)
    {
        this.client = client;
        this.dir = dir;
        this.prefix = prefix;
        this.testGuildId = guild;
        this.owners = owners
        this.noUpdates = noUpdates;
        this.commands = [];
        
        this.slashCommandManager = new SlashCommandManager(client);

        this.client.on('interactionCreate', (interaction) => this.#interactionHandler(interaction));
        this.client.on('messageCreate', (message) => this.#messageHandler(message));
        this.client.on('ready', () => this.#readyHandler());
    }

    async loadExtension(name: string): Promise<void>
    {
        const command = (await import(path.join(this.dir, name))).default as KCommand;

        if (!command.slash && !command.legacy) throw new Error(`Command type cannot be \`Not legacy\` and \`Not slash\``);

        if (command.slash)
            if (command.guildOnly)
                await this.#registerGuildSlashCommand(SlashCommandParser.parseSlashCommand(command, this.testGuildId));
            else
                await this.#registerGlobalSlashCommand(SlashCommandParser.parseSlashCommand(command));


        this.commands.push(command);  
    }

    async #interactionHandler(interaction: Interaction)
    {
        if (!interaction.isCommand()) return;

        const restrictedFilter = ({interaction, message}: {interaction?: Interaction, message?: Message}) => {
            if (!this.owners) return false;
            if (interaction && this.owners.includes(interaction.user.id)) return true;
            if (message && this.owners.includes(message.author.id)) return true;
            return false;
        }
        const getParsedOptions = (options:readonly CommandInteractionOption[], sub?: string | null, group?: string | null): IListenerOptions => {
            const parsed_options:IListenerOptions = SlashCommandParser.parseInteractionOptions(options);
            return (group && sub) ? parsed_options[group][sub] || {} : (sub ? parsed_options[sub] || {} : parsed_options || {});
        }

        const [sub, group] = [interaction.options.getSubcommand(false),interaction.options.getSubcommandGroup(false)];
        const params = {interaction, client: this.client, channel: interaction.channel as TextChannel, guild: interaction.guild};
        const options = getParsedOptions(interaction.options.data, sub, group);

        this.commands.filter(e => 
            e.name == interaction.commandName && 
            e.slash == true && 
            (this.testGuildId === interaction.command?.guildId || !e.guildOnly)
            ).forEach(async (command) => {
                let result;
                if (command.restricted && !restrictedFilter({interaction})) return;
                if (sub && group && command.groupListeners && command.groupListeners[group][sub])
                    result = await command.groupListeners[group][sub](params, options);
                else if (sub && !group && command.subListeners && command.subListeners[sub])
                    result = await command.subListeners[sub](params, options);
                else if (!sub && !group && command.listener)
                    result = await command.listener(params, options);
                
                if (result && !interaction.replied)
                    await interaction.reply(result);
        });
    
    }
    async #messageHandler(message: Message)
    {
        if (!message.content.startsWith(this.prefix) || message.type != "DEFAULT" || message.author.bot) return;

        const restrictedFilter = ({interaction, message}: {interaction?: Interaction, message?: Message}) => {
            if (!this.owners) return false;
            if (interaction && this.owners.includes(interaction.user.id)) return true;
            if (message && this.owners.includes(message.author.id)) return true;
            return false;
        }

        const messageContent = message.content.slice(this.prefix.length);
        const commandName = messageContent.match(/^[^ ]*/)![0];
        if (!commandName) return;
        // const parsed_content = message.content.split(' ')
        // const options = parsed_content.slice(1);

        this.commands.filter(e => 
            e.name == commandName && 
            e.legacy == true && 
            (this.testGuildId === message.guildId || !e.guildOnly)
            ).forEach(command => {
                if (command.restricted && !restrictedFilter({message})) return;
                // throw new Error("No legacy command support")
        });
    }

    async #readyHandler()
    {
        this.slashCommandManager = new SlashCommandManager(this.client, this.testGuildId);

        // Load all commands from directory
        let commandFiles = fs.readdirSync(this.dir);
        for (const file of commandFiles)
            await this.loadExtension(file);
        
        // Remove unwanted registered commands
        const registered_guild_commands = await this.slashCommandManager.getGuildCommands();
        const loaded_guild_commands = this.commands.filter(c => c.guildOnly).map(c => c.name);

        for (const registered_command of registered_guild_commands)
            if (!loaded_guild_commands.includes(registered_command[1].name))
                await this.slashCommandManager.deleteGuild(registered_command[1]);

        const registered_global_commands = await this.slashCommandManager.getGlobalCommands();
        const loaded_global_commands = this.commands.filter(c => !c.guildOnly).map(c => c.name);

        for (const registered_command of registered_global_commands)
            if (!loaded_global_commands.includes(registered_command[1].name))
                await this.slashCommandManager.deleteGlobal(registered_command[1]);
    }

    async #registerGuildSlashCommand(command: ISlashCommand)
    {
        const appCommand = await this.slashCommandManager.getGuildCommand(command);
        if (!appCommand) this.slashCommandManager.registerGuild(command);
        else if (appCommand && !this.noUpdates) this.slashCommandManager.editGuild(appCommand, command);
    }

    async #registerGlobalSlashCommand(command: ISlashCommand)
    {
        const appCommand = await this.slashCommandManager.getGlobalCommand(command);
        if (!appCommand) this.slashCommandManager.registerGlobal(command);
        else if (appCommand && !this.noUpdates) this.slashCommandManager.editGlobal(appCommand, command);
    }
}