"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class Button {
    component;
    restraint;
    id;
    restricted;
    listener;
    constructor({ label, emoji, style, url, disabled, restricted, restraint, listener }) {
        this.id = Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2);
        this.restraint = restraint;
        this.component = new discord_js_1.MessageButton({
            customId: !Boolean(url) ? this.id : undefined,
            label: label,
            emoji: emoji,
            style: style,
            url: url,
            disabled: disabled
        });
        this.restricted = restricted || false;
        this.listener = listener;
    }
    get url() {
        return this.component.url;
    }
}
exports.default = Button;
