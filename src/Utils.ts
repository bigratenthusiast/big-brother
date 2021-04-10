import * as wavConverter from "wav-converter"
import fs from "fs";
import {MessageEmbed} from "discord.js";

/**
 * @description A class where I cram in all the ugly functions
 */
export class Utils {
    public static config = require("../config.json");
    public static 1984 = require("../1984.json");
    public static cacheDir = "./cache";

    public static createWavStream = function(data) {
        let wavData = wavConverter.encodeWav(data, {
            numChannels: 1,
            sampleRate: 16000,
            byteRate: 16
        });
        return wavData
    };

    public static remove(id) {
        try {
            fs.unlink(`${this.cacheDir}/${id}.wav`, () => {});
            fs.unlink(`${this.cacheDir}/${id}.pcm`, () => {})
        } catch (e) {
            console.log(e)
        }
    }

    public static cleanUp() {
        try { fs.rmdirSync(this.cacheDir, {recursive: true}) } catch (e) {
            console.error("Error deleting cache directory")
        }
        try { fs.mkdirSync(this.cacheDir) } catch (e) {
            console.error("Error creating cache directory")
        }
    }
    public static orwell():string {
        return `${Math.random() * 9999}`;
    }

    public static generateMarkovChain(markovTextInput):string {
        const markovChain = {};
        const textArray = markovTextInput.split(' ');
        for (let mot = 0; mot < textArray.length; mot++) {
            let word = textArray[mot].toLowerCase().replace(/[\W_]/, "");
            if (!markovChain[word]) markovChain[word] = [];
            if (textArray[mot + 1]) markovChain[word].push(textArray[mot + 1].toLowerCase().replace(/[\W_]/, ""));
        }
        const words = Object.keys(markovChain);
        let word = words[Math.floor(Math.random() * words.length)];
        let result = "";
        for (let mot = 0; mot < words.length; mot++) {
            result += word + " ";
            word = markovChain[word][Math.floor(Math.random() * markovChain[word].length)];
            if (!word || !markovChain.hasOwnProperty(word)) word = words[Math.floor(Math.random() * words.length)];
        }
        return result;
    }

    public static async fetchMessagesMass(channel, author, limit = 500):Promise<string[]> {
        const messagesList = [];
        let previousMessageId;
        let iterations = 0;
        while (true) {
            const options = { limit: 100,
                before: undefined
            };
            if (previousMessageId) options.before = previousMessageId;
            let messageFetching = (await channel.messages.fetch(options)).forEach(m => {
                iterations++;
                previousMessageId = m.id;
                if (m.author.id === author) messagesList.push(`${m.content}`);
            });
            if (messagesList.length >= limit || iterations > 1000) break;
        }
        return messagesList;
    }

    public static async generateAndSend(message, id, a, b, person) {
        await this.fetchMessagesMass(message.channel, id, a).then(messages => {
            message.channel.send("Fetching complete synthesis initialized.")
            let markovChain = this.generateMarkovChain(messages.join(" ")).split(" ");
            let result:string = markovChain.splice(0, b).join(" ").replace(/http\/\//g, "http://").replace(/https\/\//g, "https://");
            message.channel.send(new MessageEmbed()
                .setAuthor(person, message.guild.members.cache.get(id).user.avatarURL({format: "png", size: 64}))
                .setDescription(result)
                .setColor("#eaaded")
            );
        })
    }


    public static log(message) {
        // literally just for consistency otherwise this would drive me nuts :sike:
        console.log(message);
    }
    public static notify(message) {
        console.log(`\x1b[32m${message}\x1b[0m`);
    }
    public static mysterious(message) {
        console.log(`\x1b[36m${message}\x1b[0m`);
    }
    public static warn(message) {
        console.log(`\x1b[33m${message}\x1b[0m`);
    }
    public static alert(message) {
        console.log(`\x1b[31m${message}\x1b[0m`);
    }
}