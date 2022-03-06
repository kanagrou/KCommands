export interface ISlashChoice {
    name: string,
    value: string | number
}

export interface ISlashOption {
    type: number,
    name: string,
    description: string,
    required?: boolean,
    choices?: ISlashChoice[],
    options?: ISlashOption[],
    channel_types?: number,
    min_value?: number,
    max_value?: number,
    autocomplete?: boolean
}

export interface ISlashCommand {
    name: string,
    description: string,
    application_id?: string,
    guild_id?: string,
    options?: ISlashOption[],
    default_permission?: boolean,
}