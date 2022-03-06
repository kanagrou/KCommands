import { CommandInteractionOption } from "discord.js";
import KCommand from "./command";
import { ISlashCommand, ISlashOption } from "./slashtypes";
import { IListenerOptions } from './command';
export declare type TStringOptionTypes = "group" | "sub" | "string" | "int" | "bool" | "user" | "channel" | "role" | "mention" | "number";
export declare type TOptionParameter = "required" | "min" | "max" | "autocomplete" | "choices" | "channeltypes";
export declare type TOptionParameterTypes = "bool" | "number" | "string" | "int" | "choice" | "relative";
export declare type TOptionParameterName = "required" | "min_value" | "max_value" | "autocomplete" | "choices" | "channel_types";
export declare const OptionParameters: {
    [param: string]: {
        type: TOptionParameterTypes;
        name: TOptionParameterName;
        array?: boolean | undefined;
    };
};
export declare const OptionParametersTypes: string[];
export declare function parseType(str_value: string, type: TOptionParameterTypes, subtype?: TOptionParameterTypes): boolean | number | string | {
    name: string;
    value: number | string;
};
export interface ICommandArgumentParameter {
    required: string;
    min: string;
    max: string;
    autocomplete: string;
    choices: string;
    channeltypes: string;
}
export interface ICommandArgument {
    name: string;
    type: "string" | "int" | "bool" | "user" | "channel" | "role" | "mention" | "number";
    description: string;
    params?: ICommandArgumentParameter[];
}
export interface ISubCommandArgument {
    name: string;
    type: "sub";
    description: string;
    options: ICommandArgument[];
}
export interface IGroupSubCommandArgument {
    name: string;
    type: "group";
    description: string;
    options: ISubCommandArgument[];
}
export default class SlashCommandParser {
    static parseStringOptions(full_args_str: string): (ICommandArgument | ISubCommandArgument | IGroupSubCommandArgument)[];
    static parseOptions(options: (ICommandArgument | ISubCommandArgument | IGroupSubCommandArgument)[]): ISlashOption[];
    static parseSlashCommand({ name, description, options }: KCommand, guild_id?: string): ISlashCommand;
    static parseInteractionOptions(data: readonly CommandInteractionOption[]): IListenerOptions;
}
