const Command = require("../typedefs/Command");
const Discord = require("discord.js")



class stopmusic extends Command{


    constructor(client){

        super("stop","music","Bot stops playinf music and leave the channel", client)

        /**
         * 
         * @param {Discord.Message} msg 
         * @param {*} args 
         */

        this.cmd = async function(msg, args){

            if(!msg.guild) return 0;
            
            if(this.client.music.has(msg.guild.id)){

                this.client.music.get(msg.guild.id).connection.channel.leave()
                this.client.music.delete(msg.guild.id)

            }else{

                msg.channel.send("I'm not in a voice channel right now.")

            }

        }

    }

}


module.exports = stopmusic