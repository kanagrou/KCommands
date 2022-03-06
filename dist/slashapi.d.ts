import { ApplicationCommandResolvable, Client, Guild } from "discord.js";
import { ISlashCommand } from "./slashtypes";
export default class SlashCommandManager {
    client: Client;
    guild: Guild | undefined;
    constructor(client: Client, guildId?: string);
    getGlobalCommands(): Promise<import("@discordjs/collection").Collection<string, import("discord.js").ApplicationCommand<{
        guild: import("discord.js").GuildResolvable;
    }>>>;
    getGuildCommands(): Promise<import("@discordjs/collection").Collection<string, import("discord.js").ApplicationCommand<{}>>>;
    getGlobalCommandById(id: string): Promise<import("discord.js").ApplicationCommand<{
        guild: import("discord.js").GuildResolvable;
    }> | undefined>;
    getGuildCommandById(id: string): Promise<import("discord.js").ApplicationCommand<{}>>;
    getGlobalCommand(command: ISlashCommand): Promise<import("discord.js").ApplicationCommand<{
        guild: import("discord.js").GuildResolvable;
    }> | undefined>;
    getGuildCommand(command: ISlashCommand): Promise<import("discord.js").ApplicationCommand<{}> | undefined>;
    registerGlobal(command: ISlashCommand): Promise<import("discord.js").ApplicationCommand<{
        guild: import("discord.js").GuildResolvable;
    }> | undefined>;
    registerGuild(command: ISlashCommand): Promise<import("discord.js").ApplicationCommand<{}>>;
    editGlobal(command: ApplicationCommandResolvable, new_command: ISlashCommand): Promise<import("discord.js").ApplicationCommand<{
        guild: import("discord.js").GuildResolvable;
    }> | undefined>;
    editGuild(command: ApplicationCommandResolvable, new_command: ISlashCommand): Promise<import("discord.js").ApplicationCommand<{}>>;
    deleteGlobal(command: ApplicationCommandResolvable): Promise<import("discord.js").ApplicationCommand<{
        guild: import("discord.js").GuildResolvable;
    }> | null | undefined>;
    deleteGuild(command: ApplicationCommandResolvable): Promise<import("discord.js").ApplicationCommand<{}> | null>;
}
