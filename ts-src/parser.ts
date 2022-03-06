import { CommandInteractionOption } from "discord.js";
import KCommand from "./command";
import { ISlashCommand, ISlashOption } from "./slashtypes";
import { IListenerOptions } from './command'
import { ApplicationCommandOptionTypes } from "discord.js/typings/enums";

export type TStringOptionTypes = "group" | "sub" | "string" | "int" | "bool" | "user" | "channel" | "role" | "mention" | "number"
export type TOptionParameter = "required" | "min" | "max" | "autocomplete" | "choices" | "channeltypes";
export type TOptionParameterTypes = "bool" | "number" | "string" | "int" | "choice" | "relative"
export type TOptionParameterName = "required" | "min_value" | "max_value" | "autocomplete" | "choices" | "channel_types"
export const OptionParameters = {
    "required": {type:"bool", name:"required"},
    "min": {type:"relative",name:"min_value"},
    "max":{type:"relative", name:"max_value"},
    "autocomplete":{type:"bool", name:"autocomplete"},
    "choices":{type:"choice", name:"choices", array: true},
    "channeltypes":{type:"number", name:"channel_types", array: true}
} as {[param: string]: {type: TOptionParameterTypes, name: TOptionParameterName, array?: boolean}}
export const OptionParametersTypes = [
    "bool", "number", "string", "int"
]

export function parseType(str_value:string, type:TOptionParameterTypes, subtype?:TOptionParameterTypes): boolean | number | string | {name:string, value: number | string} {
    // Cleanup
    str_value = str_value.replace(/[^\S ]+/g, '');
    str_value = str_value.trim();
    
    switch (type) {
        case 'bool':
            if (str_value == 'true' || str_value == 'True') return true;
            else if (str_value == 'false' || str_value == 'False') return false;
            else throw TypeError(`Cannot cast \`${str_value}\` to \`bool\``);
        case 'number':
            try {return parseFloat(str_value)} catch (err) {throw TypeError(`Cannot cast \`${str_value}\` to \`number\``)};
        case 'string':
            return str_value;
        case 'int':
            try {return parseInt(str_value)} catch (err) {throw TypeError(`Cannot cast \`${str_value}\` to \`int\``)};
        case 'choice':
            if (!subtype) throw new Error(`Cannot cast \`${str_value}\` to \`choice\` without a Subtype`)
            if (!(['number', 'string', 'int']).includes(subtype)) throw new Error(`Cannot cast \`${str_value}\` to \`choice\``)
            return {name:str_value.split(';')[0], value: parseType(str_value.split(';')[1], subtype) as "number" | "string"}
        default:
            throw new TypeError(`Invalid parameter type \`${type}\``);
    }
}

export interface ICommandArgumentParameter {
    required: string,
    min: string,
    max: string,
    autocomplete: string,
    choices: string,
    channeltypes: string
}

export interface ICommandArgument{
    name: string,
    type: "string" | "int" | "bool" | "user" | "channel" | "role" | "mention" | "number",
    description: string,
    params?: ICommandArgumentParameter[]
}
export interface ISubCommandArgument {
    name: string,
    type: "sub",
    description: string,
    options: ICommandArgument[]
}
export interface IGroupSubCommandArgument {
    name: string,
    type: "group",
    description: string,
    options: ISubCommandArgument[]
}

const StringOptionTypes = {
    group: ApplicationCommandOptionTypes.SUB_COMMAND_GROUP,
    sub: ApplicationCommandOptionTypes.SUB_COMMAND,
    string: ApplicationCommandOptionTypes.STRING,
    int: ApplicationCommandOptionTypes.INTEGER,
    bool: ApplicationCommandOptionTypes.BOOLEAN,
    user: ApplicationCommandOptionTypes.USER,
    channel: ApplicationCommandOptionTypes.CHANNEL,
    role: ApplicationCommandOptionTypes.ROLE,
    mention: ApplicationCommandOptionTypes.MENTIONABLE,
    number: ApplicationCommandOptionTypes.NUMBER
}

export default class SlashCommandParser {
    static parseStringOptions(full_args_str: string): (ICommandArgument | ISubCommandArgument | IGroupSubCommandArgument)[] {
        const split_exluding_parantheses = (separator: string, str: string): string[] => {
            let p_count = 0;
            let indices: number[] = [];
            for (let i=0;i<str.length;++i) {
                if (str[i] === '(') p_count++;
                if (str[i] === ')') p_count--;
                if (p_count < 0) throw Error('No matching parentheses')
            
                if (p_count == 0) {
                    if (str[i] === separator)
                        indices.push(i);
                }
            }

            let result: string[] = []

            for (const [i, index] of indices.entries())
                result.push(str.slice(indices[i-1] ? indices[i-1]+1 : 0, index));
            result.push(str.slice(indices[indices.length-1]+1, str.length));

            return result;
        }
        const parseSingleStringOption = (arg_str:string): ICommandArgument | ISubCommandArgument | IGroupSubCommandArgument  => {
            // Remove Leading and Trailing Whitespace
            arg_str = arg_str.trim();
            
            if (arg_str === null) throw Error("Parse Error: Null argument");

            let arg = {} as any;

            // Get name of argument
            const name_match = arg_str.match(/[^<]*/);
            if (!name_match) throw new Error("Parse Error: No name found");
            const name = name_match[0];
            arg.name = name;
            const discordApiChatInputRegEx = /^[\w-]{1,32}$/;
            if (!name.match(discordApiChatInputRegEx)) throw new Error(`Parse Error: Invalid name \`${name}\``)
            
            // Get type of argument
            const type_match = arg_str.match(/(?<=<).*?(?=>)/)
            if (!type_match) throw new Error("Parse Error: No type found");
            const type = type_match[0];
            if (!(type in StringOptionTypes))
                throw new Error(`Parse Error: Unknown type \`${type}\``)
            arg.type = type;
            
            // Get descripton of argument
            let description_match = arg_str.match(/(?<!\(.*)(?<=\[).*?(?=\])/); // At the beginning
            if (!description_match) 
                description_match = arg_str.match(/(?!.*\))(?<=\[).*?(?=\])/); // At the end
            if (!description_match) throw new Error("Parse Error: No description found"); 
            const description = description_match[0];
            arg.description = description;

            // Get Params or Options of argument
            if (arg.type === 'group' || arg.type === 'sub') {
                const options_match = arg_str.match(/(?<=\().*(?=\))/)
                if (!options_match) throw new Error("Parse Error: Can't have empty groups and subs");
                const options = options_match[0];
                arg.options = this.parseStringOptions(options);
                return arg as ISubCommandArgument | IGroupSubCommandArgument;
            } else {
                const params_match = arg_str.match(/(?<=\().*(?=\))/)
                if (!params_match) return arg;
                const params = params_match[0];
                arg.params = [];
                split_exluding_parantheses('&', params).map(p => {
                    let [n, v] = p.split(':');
                    n = n.trim();
                    if (!(n in OptionParameters))
                        throw new Error(`Parse Error: Invalid option parameter \`${n}\``);
                    if (!v)
                        v = 'true';
                    return [n, v.trim()];
                }).forEach(p => {arg.params.push({[p[0]]: p[1]})});
                return arg as ICommandArgument;
            }
        }

        let parsed_args: (ICommandArgument | ISubCommandArgument | IGroupSubCommandArgument)[] = [];

        // Remove all whitespace except Spaces and trim
        full_args_str = full_args_str.replace(/[^\S ]+/g, '');
        full_args_str.trim();
        
        // Seperate arguments
        let args_str = split_exluding_parantheses('&', full_args_str);

        // Parse all arguments
        for (const arg_str of args_str) {
            parsed_args.push(parseSingleStringOption(arg_str));
        }

        return parsed_args;

        

    }

    static parseOptions(options: (ICommandArgument | ISubCommandArgument | IGroupSubCommandArgument)[]): ISlashOption[] {
        const parseSingleOption = (option: ICommandArgument | ISubCommandArgument | IGroupSubCommandArgument): ISlashOption => {
            if (!(option.type in StringOptionTypes)) throw new TypeError(`Invalid type \`${option.type}\``);
            
            // Initialize Slash Option Object
            let slash_option: ISlashOption = {
                name: option.name,
                description: option.description,
                type: StringOptionTypes[option.type]
            };

            // Add Options or Params to the Slash Option Object
            if (slash_option.type === ApplicationCommandOptionTypes.SUB_COMMAND_GROUP || slash_option.type === ApplicationCommandOptionTypes.SUB_COMMAND) {
                const group = option as IGroupSubCommandArgument | ISubCommandArgument;
                if (!group.options) throw new Error("Parse Error: Can't have empty groups")
                slash_option.options = this.parseOptions(group.options)
            }
            else {
                const arg = option as ICommandArgument;
                const parseParameter = (p: ICommandArgumentParameter) => {
                    const pn = Object.keys(p)[0] as TOptionParameter
                    const pt = OptionParameters[pn];
                    let type: TOptionParameterTypes = pt.type;
                    let isArray = pt.array;
                    if (type === 'relative') {
                        if (!OptionParametersTypes.includes(arg.type)) throw new Error(`Invalid parameter for type ${arg.type}`)
                        type = arg.type as TOptionParameterTypes;
                    }

                    let value: any;
                    if (isArray)
                        value = p[pn].split(',').map(t => parseType(t, type as TOptionParameterTypes, arg.type as TOptionParameterTypes));
                    else
                        value = parseType(p[pn], type as TOptionParameterTypes, arg.type as TOptionParameterTypes);
                    
                    
                    slash_option[pt.name] = value as any;
                }

                if (arg.params) {
                    arg.params.forEach(parseParameter);
                }
            }

            return slash_option;
        }

        let slash_options: ISlashOption[] = [];

        for (const option of options) {
            slash_options.push(parseSingleOption(option));
        }

        return slash_options;
    }
    static parseSlashCommand({name, description, options}: KCommand, guild_id?:string) {
        let parsed_options: ISlashOption[] | undefined;
        if (options)
            parsed_options = this.parseOptions(this.parseStringOptions(options));
        
        let slash_command:ISlashCommand = {
            name:name,
            description:description,
            options:parsed_options,
            guild_id:guild_id
        };
        return slash_command
    }
    static parseInteractionOptions(data: readonly CommandInteractionOption[]): IListenerOptions {
        let options:IListenerOptions = {};
        for (const option of data) {
            if (option.options)
                options[option.name] = this.parseInteractionOptions(option.options);
            switch(option.type) {
                case 'BOOLEAN':
                case 'INTEGER':
                case 'NUMBER':
                case 'STRING':
                    options[option.name] = option.value;
                    break;
                case 'USER':
                    options[option.name] = option.user;
                    break;
                case 'ROLE':
                    options[option.name] = option.role;
                    break;  
                case 'CHANNEL':
                    options[option.name] = option.channel;
                    break;
                case 'MENTIONABLE':
                    options[option.name] = option.user || option.role || option.channel || null;
                    break;
            }
        }
        return options;
    }
}


/*
    Example Option String:

    """
    mentions<group>[Mentionnables] (
        user<sub>[Users] (
            user<user>(required)[User to mention]  &
            message<string>(required & min:1)[Message to send to user]
        )
    )
    """

*/

/*

    Accepted command types:

    - group
    - sub
    - string
    - int
    - bool
    - user
    - channel
    - role
    - mention
    - number

*/

/*

    Accepted command parameters:

    - required          ( bool )
    - min               ( integer or double )
    - max               ( integer or double )
    - autocomplete      ( bool )
    - choices           ( Array<string;string or integer or double> )      * Name ; Value
    - channeltypes      ( Array<number> )                                  * ChannelType


*/