import {Command} from "../Command";
import {Utils} from "../../Utils";
import {MessageEmbed} from "discord.js";

export class Amalgomate extends Command {
    public static identifier = "amalgomate";
    public static description = "oooo aaaa";
    public static aliases = ["gen", "markov"];

    async exec() {
        this.args[0] = this.args[0].toLowerCase();
        if (!this.args[0] || !Utils.config.usermap[this.args[0]]) {
            await this.message.channel.send("Please specific a user to run this command on from this list:\n- " + Object.keys(Utils.config.usermap).join("\n- "))
        } else {
            await this.message.channel.send("Generating markov chain (this will take a bunch of time)")
            await Utils.generateAndSend(this.message, Utils.config.usermap[this.args[0]], 32, 10, this.args[0]);
        }
    }
}