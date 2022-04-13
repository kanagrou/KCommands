import { CommandInteraction, MessageActionRow } from 'discord.js';
import Button from './button';
interface IComponentRow extends Array<Button> {
}
interface IComponents {
    rows: IComponentRow[];
}
export default class Components {
    interaction: CommandInteraction;
    rows: IComponentRow[];
    constructor(interaction: CommandInteraction, { rows }: IComponents);
    make(): MessageActionRow[];
    rowOf(id: string): number;
    colOf(id: string): number;
    equal(other: MessageActionRow[]): boolean;
    collect(time: number): void;
}
export {};
