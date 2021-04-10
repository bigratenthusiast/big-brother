import {Command} from "../Command";

export class Leave extends Command {
    public static identifier = "leave";
    public static description = "goodbye sir";
    public static aliases = [];

    exec() {
        this.message.member.voice.channel.leave();
    }
}