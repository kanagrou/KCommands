import { MessageSelectMenu, MessageSelectOptionData, SelectMenuInteraction } from "discord.js";
interface ISelect {
    placeholder?: string;
    disabled?: boolean;
    restricted?: boolean;
    restraint?: number;
    selection?: {
        min?: number;
        max?: number;
    };
    options?: MessageSelectOptionData[];
    listener?: (interaction: SelectMenuInteraction) => void;
}
export default class Select {
    component: MessageSelectMenu;
    restraint?: number;
    readonly id: string;
    restricted: boolean;
    listener?: (interaction: SelectMenuInteraction) => void;
    constructor({ placeholder, disabled, restricted, selection, restraint, options, listener }: ISelect);
    get options(): import("discord.js").MessageSelectOption[];
}
export {};
