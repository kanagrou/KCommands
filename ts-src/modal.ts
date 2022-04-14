/* Not supported by Discord.js */

interface IModal {
    title?: string,
    listener?: (interaction: any) => void
}

export default class Modal {

    component: any;
    readonly id: string;
    listener?: (interaction: any) => void;

    constructor({title, listener}: IModal)
    {
        this.id = Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2);
        this.component = {};
        this.listener = listener;
    }
}