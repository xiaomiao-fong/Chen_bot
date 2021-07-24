const Discord = require("discord.js")
const ytdl = require("ytdl-core")
const Command = require("../../typedefs/Command")
const MusicPlayer = require("../../typedefs/MusicPlayer")

class join extends Command{

    constructor(client){

        super("join","music",client)
        
        
        /**
         * 
         * @param {Discord.Message} msg 
         * @param {*} arg 
         */

        this.cmd = async function(msg,arg){

            if(!msg.guild) return 0;

            if(this.client.music.has(msg.guild.id)) {

                msg.channel.send("I'm already in a voice channel!")
                return 0;

            }

            if(msg.member.voice.channel){

                const connection = await msg.member.voice.channel.join()
                let musicplayer = new MusicPlayer(this.client,connection)
                this.client.music.set(msg.guild.id,musicplayer)
                return 1;

            }else{

                msg.reply("You have to join in a voice channel first.")
                return 0;

            }


        }

    }

}



module.exports = join
