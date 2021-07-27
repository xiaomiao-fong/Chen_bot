const Discord = require("discord.js")
const ytdl = require("ytdl-core")
const Command = require("../../typedefs/Command")
const MusicPlayer = require("../../typedefs/MusicPlayer")

class join extends Command{

    constructor(client){

        super("join","music",client);
        
        
        /**
         * 
         * @param {Discord.Message} msg 
         * @param {*} arg 
         */

        this.cmd = async function(msg,arg){

            let userlang = msg.author.lang;

            if(!msg.guild) return 0;

            if(this.client.music.has(msg.guild.id)) {

                msg.channel.send(this.lang[userlang].channel_alr);
                return 0;

            }

            if(msg.member.voice.channel){

                const connection = await msg.member.voice.channel.join();
                let musicplayer = new MusicPlayer(this.client,connection);
                this.client.music.set(msg.guild.id,musicplayer);
                return 1;

            }else{

                msg.reply(this.lang[userlang].channel_first);
                return 0;

            }


        };

        this.lang = {

            "zh_TW":
            {
                "channel_first" : "請先加入一個語音頻道",
                "channel_alr" : "我已經在一個語音頻道裡了"
            },
            "en_US":
            {
                "channel_first" : "You have to join in a voice channel first.",
                "channel_alr" : "I'm already in a voice channel!"
            }
         }

    }

}



module.exports = join
