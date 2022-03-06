"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SlashCommandManager {
    client;
    guild;
    constructor(client, guildId) {
        this.client = client;
        if (!guildId)
            return;
        this.guild = this.client.guilds.cache.get(guildId);
        if (!this.guild)
            throw new Error(`Guild ID not found: ${guildId}`);
    }
    async getGlobalCommands() {
        return this.client.application.commands.fetch();
    }
    async getGuildCommands() {
        if (!this.guild)
            throw new Error(`No guild ID specified`);
        return this.guild.commands.fetch();
    }
    async getGlobalCommandById(id) {
        return this.client.application?.commands.fetch(id);
    }
    async getGuildCommandById(id) {
        if (!this.guild)
            throw new Error(`No guild ID specified`);
        return this.guild.commands.fetch(id);
    }
    async getGlobalCommand(command) {
        return this.client.application.commands.fetch().then(coll => coll.find(cmd => cmd.name === command.name));
    }
    async getGuildCommand(command) {
        if (!this.guild)
            throw new Error(`No guild ID specified`);
        return this.guild.commands.fetch().then(coll => coll.find(cmd => cmd.name === command.name));
    }
    async registerGlobal(command) {
        if (await this.getGlobalCommand(command))
            throw Error(`Registered command already exists: ${command.name}\nConsider updating already existing commands.`);
        return this.client.application?.commands.create(command);
    }
    async registerGuild(command) {
        if (!this.guild)
            throw new Error(`No guild ID specified`);
        if (await this.getGuildCommand(command))
            throw Error(`Registered command already exists: ${command.name}\nConsider updating already existing commands.`);
        return this.guild.commands.create(command);
    }
    async editGlobal(command, new_command) {
        return this.client.application?.commands.edit(command, new_command);
    }
    async editGuild(command, new_command) {
        if (!this.guild)
            throw new Error(`No guild ID specified`);
        return this.guild.commands.edit(command, new_command);
    }
    async deleteGlobal(command) {
        return this.client.application?.commands.delete(command);
    }
    async deleteGuild(command) {
        if (!this.guild)
            throw new Error(`No guild ID specified`);
        return this.guild.commands.delete(command);
    }
}
exports.default = SlashCommandManager;
