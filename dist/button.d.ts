import { ButtonInteraction, MessageButton, MessageButtonStyle } from "discord.js";
interface IButton {
    label?: string;
    emoji?: string;
    style?: MessageButtonStyle;
    url?: string;
    disabled?: boolean;
    restricted?: boolean;
    restraint?: number;
    listener?: (interaction: ButtonInteraction) => void;
}
export default class Button {
    component: MessageButton;
    restraint?: number;
    readonly id: string;
    restricted: boolean;
    listener?: (interaction: ButtonInteraction) => void;
    constructor({ label, emoji, style, url, disabled, restricted, restraint, listener }: IButton);
    get url(): string | null;
}
export {};
