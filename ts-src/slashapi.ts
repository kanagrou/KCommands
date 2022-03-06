import { ApplicationCommandResolvable, Client, Guild } from "discord.js";
import { ISlashCommand } from "./slashtypes";


export default class SlashCommandManager {

    client: Client;
    guild: Guild | undefined

    constructor(client: Client, guildId?: string) {
        this.client = client;
        if (!guildId) return;
        this.guild = this.client.guilds.cache.get(guildId);
        if (!this.guild) throw new Error(`Guild ID not found: ${guildId}`);
    }

    async getGlobalCommands() {
        return this.client.application!.commands.fetch();
    }
    async getGuildCommands() {
        if (!this.guild) throw new Error(`No guild ID specified`);
        return this.guild.commands.fetch();
    }

    async getGlobalCommandById(id: string) {
        return this.client.application?.commands.fetch(id);
    }
    async getGuildCommandById(id: string) {
        if (!this.guild) throw new Error(`No guild ID specified`);
        return this.guild.commands.fetch(id);
    }

    async getGlobalCommand(command: ISlashCommand) {
        return this.client.application!.commands.fetch().then(coll => coll.find(cmd => cmd.name === command.name));
    }
    async getGuildCommand(command: ISlashCommand) {
        if (!this.guild) throw new Error(`No guild ID specified`);
        return this.guild.commands.fetch().then(coll => coll.find(cmd => cmd.name === command.name));
    }
    
    async registerGlobal(command: ISlashCommand) {
        if (await this.getGlobalCommand(command))
            throw Error(`Registered command already exists: ${command.name}\nConsider updating already existing commands.`);
        return this.client.application?.commands.create(command);
    }
    async registerGuild(command: ISlashCommand) {
        if (!this.guild) throw new Error(`No guild ID specified`);
        if (await this.getGuildCommand(command))
            throw Error(`Registered command already exists: ${command.name}\nConsider updating already existing commands.`);
        return this.guild.commands.create(command);
    }

    async editGlobal(command: ApplicationCommandResolvable, new_command: ISlashCommand) {
        return this.client.application?.commands.edit(command, new_command);
    }
    async editGuild(command: ApplicationCommandResolvable, new_command: ISlashCommand) {
        if (!this.guild) throw new Error(`No guild ID specified`);
        return this.guild.commands.edit(command, new_command);
    }

    async deleteGlobal(command: ApplicationCommandResolvable) {
        return this.client.application?.commands.delete(command);
    }
    async deleteGuild(command: ApplicationCommandResolvable) {
        if (!this.guild) throw new Error(`No guild ID specified`);
        return this.guild.commands.delete(command);
    }
}