interface IModal {
    title?: string;
    listener?: (interaction: any) => void;
}
export default class Modal {
    component: any;
    readonly id: string;
    listener?: (interaction: any) => void;
    constructor({ title, listener }: IModal);
}
export {};
