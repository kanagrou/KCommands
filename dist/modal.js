"use strict";
/* Not supported by Discord.js */
Object.defineProperty(exports, "__esModule", { value: true });
class Modal {
    component;
    id;
    listener;
    constructor({ title, listener }) {
        this.id = Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2);
        this.component = {};
        this.listener = listener;
    }
}
exports.default = Modal;
