import {Command} from "../Command";
import {Utils} from "../../Utils";
import fs from "fs";
import * as wavConverter from "wav-converter"
import * as child_process from "child_process";
import {MessageHandler} from "../../MessageHandler";

const config = Utils.config;
const exec = child_process.exec;

export class Join extends Command {
    public static identifier = "join";
    public static description = "join and 1984";
    public static aliases = [];

    async exec() {
        // If the bot is currently in a voice channel, leave it
        if (this.message.guild.members.cache.get(this.client.user.id).voice.channel) {
            this.message.guild.members.cache.get(this.client.user.id).voice.channel.leave();
        }
        const connection = await this.message.member.voice.channel.join();

        Utils.notify(`Joined ${(connection).channel.name}`);

        // Thee Discord API prohibits bots from listening unless they have spoke
        // hence the need to play a "void" audio file at 0 volume
        connection.play(fs.createReadStream('./void.wav'), {volume: 0}).on("error", (err => Utils.alert(err)));

        connection.on("speaking", (user, speaking) => {
            // As much as I detest grooby I would hate to have "Trance Racing Music 10 Hours" clog up the bot
            // While it trys to search the aforementioned audio for "fortnite"
            if (user.bot) return;
            if (speaking.bitfield) {
                let id = `${new Date().getTime()}-${user.id}`;
                connection.receiver.createStream(user, {mode: "pcm"})
                    .pipe(fs.createWriteStream(`${Utils.cacheDir}/${id}.pcm`))
                    .on("close", () => {
                        let wavData = wavConverter.encodeWav(fs.readFileSync(`${Utils.cacheDir}/${id}.pcm`), {
                            numChannels: 2,
                            sampleRate: 44100,
                            byteRate: 16
                        });
                        if (wavData.length > (8 * 10000)) {
                            // Lets save the audio file
                            fs.writeFileSync(`${Utils.cacheDir}/${id}.wav`, wavData);
                            // Alright lets task our python file to scan the audio
                            const Scan = exec(`python${config["python3"]?"3":""} driver.py ${id}.wav`);

                            Scan.stdout.on('data', async (data) => {
                                try {
                                    let result = JSON.parse(data);
                                    switch (result.code) {
                                        case 0:
                                            // Now we got the data, lets task the bot with determining what to do
                                            MessageHandler.handleVoiceMessage(result.text, user, this.message.member, this.message.member.voice.channel);
                                            Utils.remove(id);
                                            break;
                                        case 1:
                                            Utils.alert(`Invalid args provided of audio file of id ${id}`);
                                            Utils.remove(id);
                                            break;
                                        case 2:
                                            Utils.remove(id);
                                            break
                                    }
                                    Scan.kill()
                                } catch (err) {
                                    Utils.alert(`Failed to parse JSON response of scanning of audio file of id ${id}`);
                                    console.log(`Details on error: ${err}`);
                                    Utils.remove(id);
                                    Scan.kill()
                                }
                            });
                            Scan.stderr.on('data', async (data) => {
                                Scan.kill();
                                Utils.alert(`Some sort of stderr: ${data}`);
                                Utils.remove(id)
                            })
                        }
                    })
            }
        })
    }
}