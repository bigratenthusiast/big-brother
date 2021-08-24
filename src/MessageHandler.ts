import {GuildMember, Message, User, VoiceChannel} from "discord.js";
import {Utils} from "./Utils";

export class MessageHandler {
    public static handleVoiceMessage(content: string, author: User, member: GuildMember, channel: VoiceChannel) {
        content = content.toLowerCase();
        Utils["1984"].voice.allow.forEach(allowed => {
            if (content.includes(allowed)) return;
        })
        Utils["1984"].voice.deny.forEach(denied => {
            if (content.includes(denied)) {
                // noinspection JSIgnoredPromiseFromCall
                member.guild.members.cache.get(author.id).voice.kick();
            }
        })
        console.log(content);
    }
    public static handleTextMessage(message: Message) {
        let content:string = message.content.toLowerCase();
        let fail;
        Utils["1984"].text.allow.forEach(allowed => {
            if (content.includes(allowed)) fail = true;
        })
        if (fail) return;
        Utils["1984"].text.deny.forEach(denied => {
            if (content.includes(denied)) {
                // noinspection JSIgnoredPromiseFromCall
                message.delete();
            }
        })
        Utils["1984"].text.orwell.forEach(denied => {
            if (content.includes(denied)) {
                message.channel.send(Utils.orwell());
                // noinspection JSIgnoredPromiseFromCall
                message.delete();
            }
        })
    }
}
