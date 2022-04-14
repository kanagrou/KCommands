import {MessageSelectMenu, MessageSelectMenuOptions, MessageSelectOptionData, SelectMenuInteraction } from "discord.js"

interface ISelect {
    placeholder?: string,
    disabled?: boolean,
    restricted?: boolean,
    restraint?: number,
    selection?: {min?:number, max?:number},
    options?: MessageSelectOptionData[],

    listener?: (interaction: SelectMenuInteraction) => void
}

export default class Select {

    component: MessageSelectMenu;
    restraint?: number;
    readonly id: string;
    restricted: boolean;
    listener?: (interaction: SelectMenuInteraction) => void;

    constructor({placeholder, disabled, restricted, selection, restraint, options, listener}: ISelect)
    {
        this.id = Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2);
        this.restraint = restraint;
        this.component = new MessageSelectMenu({
            customId: this.id,
            placeholder: placeholder,
            minValues: selection?.min,
            maxValues: selection?.max,
            options: options,
            disabled: disabled
        } as MessageSelectMenuOptions);
        this.restricted = restricted || false;
        this.listener = listener;
    }

    get options() {
        return this.component.options;
    }
}