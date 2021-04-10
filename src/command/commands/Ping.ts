import {Command} from "../Command";

export class Ping extends Command {
    public static identifier = "ping";
    public static description = "test if online";
    public static aliases = [];

    exec() {
        // noinspection JSIgnoredPromiseFromCall
        this.message.channel.send("Pong");
    }
}