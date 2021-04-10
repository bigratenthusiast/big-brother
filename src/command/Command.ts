import {ICommand} from "./ICommand";
import {Client, Message} from "discord.js";

export class Command implements ICommand {
    constructor(client: Client, message: Message, args: string[]) {
        this.client = client;
        this.message = message;
        this.args = args;
    }

    // @ts-ignore
    exec() {

    }

    client: Client
    message: Message
    args: string[]

    identifier: string;
    description: string;
    aliases: string[] = [];
}