"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class Components {
    interaction;
    rows;
    constructor(interaction, { rows }) {
        this.interaction = interaction;
        this.rows = rows;
    }
    make() {
        let _rows = [];
        for (const row of this.rows) {
            let _row = new discord_js_1.MessageActionRow();
            for (const component of row)
                _row.components.push(component.component);
            _rows.push(_row);
        }
        return _rows;
    }
    #rowOf(id) {
        const components = this.make();
        for (let i = 0; i < components.length; i++)
            for (let j = 0; j < components[i].components.length; j++)
                if (components[i].components[j].customId == id)
                    return i;
        return -1;
    }
    #colOf(id) {
        const components = this.make();
        for (let i = 0; i < components.length; i++)
            for (let j = 0; j < components[i].components.length; j++)
                if (components[i].components[j].customId == id)
                    return j;
        return -1;
    }
    #equal(other) {
        if (!other)
            return false;
        const components = this.make();
        if (components.length != other.length)
            return false;
        for (let i = 0; i < components.length; i++)
            for (let j = 0; j < components[i].components.length; j++)
                if (components[i].components[j].customId != other[i].components[j].customId)
                    return false;
        return true;
    }
    collect(time) {
        if (!this.interaction.channel) {
            throw new Error("No channel exists to place components");
        }
        for (const row of this.rows) {
            for (const component of row) {
                const filter = (interaction) => Boolean(component.url) || ((!component.restricted || this.interaction.user.id === interaction.user.id) &&
                    interaction.customId == component.id);
                const collector = this.interaction.channel
                    .createMessageComponentCollector({
                    filter,
                    time,
                    max: component.restraint
                });
                collector.on('end', async (collection) => {
                    if (this.#equal((await this.interaction.fetchReply())?.components)) {
                        const compRow = this.#rowOf(component.id);
                        const compCol = this.#colOf(component.id);
                        if (compRow != -1 && compCol != -1) {
                            let newComponents = this.make();
                            newComponents[compRow].components[compCol].setDisabled(true);
                            await this.interaction.editReply({ components: newComponents });
                        }
                    }
                });
                if (component.listener)
                    collector.on('collect', component.listener);
            }
        }
    }
}
exports.default = Components;
