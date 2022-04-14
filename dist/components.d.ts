import { CommandInteraction, MessageActionRow } from 'discord.js';
import Button from './button';
import Select from './select';
interface IComponentRow extends Array<Button | Select> {
}
interface IComponents {
    rows: IComponentRow[];
}
export default class Components {
    #private;
    interaction: CommandInteraction;
    rows: IComponentRow[];
    constructor(interaction: CommandInteraction, { rows }: IComponents);
    make(): MessageActionRow[];
    collect(time: number): void;
}
export {};
