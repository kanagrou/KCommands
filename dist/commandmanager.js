"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const parser_1 = require("./parser");
const events_1 = require("events");
const slashapi_1 = require("./slashapi");
class CommandManager {
    client;
    emitter;
    dir;
    prefix;
    testGuildId;
    owners;
    noUpdates;
    slashCommandManager;
    commands;
    constructor(client, { dir, prefix, guild, owners, noUpdates }) {
        this.client = client;
        this.emitter = new events_1.EventEmitter();
        this.dir = dir;
        this.prefix = prefix;
        this.testGuildId = guild;
        this.owners = owners;
        this.noUpdates = noUpdates;
        this.commands = [];
        this.slashCommandManager = new slashapi_1.default(client);
        this.client.on('interactionCreate', (interaction) => this.#interactionHandler(interaction));
        this.client.on('messageCreate', (message) => this.#messageHandler(message));
        this.client.on('ready', () => this.#readyHandler());
    }
    async loadExtension(name) {
        const command = (await Promise.resolve().then(() => require(path.join(this.dir, name)))).default;
        const resctrictedFilter = ({ interaction, message }) => {
            if (!this.owners)
                throw new Error(`Command ${command.name} restricted without owners specified`);
            if (interaction)
                if (this.owners.includes(interaction.user.id))
                    return true;
            if (message)
                if (this.owners.includes(message.author.id))
                    return true;
            return false;
        };
        const addSlashListener = (listener, command_name, sub, group) => {
            if (command.restricted)
                this.emitter.on('$SLASH' + command_name + (group ? `$GROUP${group}` : '') + (sub ? `$SUB${sub}` : ''), (args, options) => { try {
                    if (resctrictedFilter({ interaction: args.interaction }))
                        listener(args, options);
                }
                catch (err) {
                    console.error(err);
                } });
            else
                this.emitter.on('$SLASH' + command_name + (group ? `$GROUP${group}` : '') + (sub ? `$SUB${sub}` : ''), (args, options) => { try {
                    listener(args, options);
                }
                catch (err) {
                    console.error(err);
                } });
        };
        const addLegacyListener = (listener, command_name) => {
            if (command.restricted)
                this.emitter.on('$LEGACY' + command_name, (args, options) => { if (resctrictedFilter({ interaction: args.interaction }))
                    listener(args, options); });
            else
                this.emitter.on('$LEGACY' + command_name, listener);
        };
        if (!command.slash && !command.legacy)
            throw new Error(`Command type cannot be \`Not legacy\` and \`Not slash\``);
        if (command.slash)
            if (command.guildOnly)
                await this.#registerGuildSlashCommand(parser_1.default.parseSlashCommand(command, this.testGuildId));
            else
                await this.#registerGlobalSlashCommand(parser_1.default.parseSlashCommand(command));
        if (command.listener) {
            if (command.slash)
                addSlashListener(command.listener, command.name);
            if (command.legacy)
                addLegacyListener(command.listener, command.name);
        }
        if (command.slash) {
            if (command.subListeners)
                for (const [subname, listener] of Object.entries(command.subListeners))
                    addSlashListener(listener, command.name, subname);
            if (command.groupListeners)
                for (const [groupname, subListeners] of Object.entries(command.groupListeners))
                    for (const [subname, listener] of Object.entries(subListeners))
                        addSlashListener(listener, command.name, subname, groupname);
        }
        this.commands.push(command);
    }
    async #interactionHandler(interaction) {
        if (!interaction.isCommand())
            return;
        const getParsedOptions = (options, sub, group) => {
            const parsed_options = parser_1.default.parseInteractionOptions(options);
            return (group && sub) ? parsed_options[group][sub] || {} : (sub ? parsed_options[sub] || {} : parsed_options || {});
        };
        const emitListener = (options_data, command, sub, group) => {
            this.emitter.emit('$SLASH' + command + (group ? `$GROUP${group}` : '') + (sub ? `$SUB${sub}` : ''), { client: this.client, interaction: interaction, channel: interaction.channel, guild: interaction.guild, user: interaction.user }, getParsedOptions(options_data, sub, group));
        };
        emitListener(interaction.options.data, interaction.commandName, interaction.options.getSubcommand(false), interaction.options.getSubcommandGroup(false));
    }
    async #messageHandler(message) {
        if (!message.content.startsWith(this.prefix) || message.type != "DEFAULT" || message.author.bot)
            return;
        const emitListener = (command, options) => {
            this.emitter.emit('$LEGACY' + command, { message: message, channel: message.channel, guild: message.guild, user: message.author, legacyOptions: options });
        };
        const parsed_content = message.content.split(' ');
        const name = parsed_content[0].replace(this.prefix, '');
        const options = parsed_content.slice(1);
        if (options)
            emitListener(name, options);
    }
    async #readyHandler() {
        this.slashCommandManager = new slashapi_1.default(this.client, this.testGuildId);
        let commandFiles = fs.readdirSync(this.dir);
        for (const file of commandFiles)
            await this.loadExtension(file);
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
    async #registerGuildSlashCommand(command) {
        const appCommand = await this.slashCommandManager.getGuildCommand(command);
        if (!appCommand)
            this.slashCommandManager.registerGuild(command);
        else if (appCommand && !this.noUpdates)
            this.slashCommandManager.editGuild(appCommand, command);
    }
    async #registerGlobalSlashCommand(command) {
        const appCommand = await this.slashCommandManager.getGlobalCommand(command);
        if (!appCommand)
            this.slashCommandManager.registerGlobal(command);
        else if (appCommand && !this.noUpdates)
            this.slashCommandManager.editGlobal(appCommand, command);
    }
}
exports.default = CommandManager;
