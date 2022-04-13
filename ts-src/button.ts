import { APIMessageComponentEmoji } from "discord-api-types";
import { ButtonInteraction, Emoji, MessageButton, MessageButtonOptions, MessageButtonStyle } from "discord.js"

interface IButton {
    label?: string,
    emoji?: string,
    style?: MessageButtonStyle,
    url?: string,
    disabled?: boolean,
    restricted?: boolean,
    restraint?: number,

    listener?: (interaction: ButtonInteraction) => void
}

export default class Button {

    component: MessageButton;
    restraint?: number;
    readonly id: string;
    restricted: boolean;
    listener?: (interaction: ButtonInteraction) => void;

    constructor({label, emoji, style, url, disabled, restricted, restraint, listener}: IButton)
    {
        this.id = Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2);
        this.restraint = restraint;
        this.component = new MessageButton({
            customId: !Boolean(url) ? this.id : undefined,
            label: label,
            emoji: emoji,
            style: style,
            url: url,
            disabled: disabled
        } as MessageButtonOptions);
        this.restricted = restricted || false;
        this.listener = listener;
    }

    get url() {
        return this.component.url;
    }
}