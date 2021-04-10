import discord, {Client} from "discord.js";
import {CommandMap} from "./command/CommandMap";
import {ICommand} from "./command/ICommand";
import {Utils} from "./Utils";
import {MessageHandler} from "./MessageHandler";

const config = Utils.config;
const client:Client = new discord.Client();
const commands:ICommand[] = CommandMap.registerCommands();

client.on("ready", () => {
  console.log("Bot is online");
  Utils.cleanUp();
});

client.on("message", message => {
  MessageHandler.handleTextMessage(message);
  let args:string[] = message.content.split(" ");
  if (args.length > 0) {
    args[0] = args[0].toLowerCase();
    if ((config["bot"]["prefix_appended"]) ? args[0].endsWith(config["bot"]["prefix"]) : args[0].startsWith(config["bot"]["prefix"])) {
      let command:string = config["bot"]["prefix_appended"] ? args.shift().replace(new RegExp(`(${config["bot"]["prefix"]})$`), "") : args.shift().replace(config["bot"]["prefix"], "");
      // @ts-ignore
      commands.forEach(it => (it.identifier == command || (!!it.aliases.length && it.aliases.some(it => it == command))) ? new it(client, message, args).exec() : {});
    }
  }
})

client.on("guildMemberAdd", member => {
  if (member.guild.id === "689287761789976629") {
    // noinspection JSIgnoredPromiseFromCall
    member.roles.add(member.guild.roles.cache.get("830190223148580925"));
  }
})


// noinspection JSIgnoredPromiseFromCall
client.login(config["bot"]["token"]);