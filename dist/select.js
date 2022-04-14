"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class Select {
    component;
    restraint;
    id;
    restricted;
    listener;
    constructor({ placeholder, disabled, restricted, selection, restraint, options, listener }) {
        this.id = Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2);
        this.restraint = restraint;
        this.component = new discord_js_1.MessageSelectMenu({
            customId: this.id,
            placeholder: placeholder,
            minValues: selection?.min,
            maxValues: selection?.max,
            options: options,
            disabled: disabled
        });
        this.restricted = restricted || false;
        this.listener = listener;
    }
    get options() {
        return this.component.options;
    }
}
exports.default = Select;
