const Command = require("../../typedefs/Command");
const Discord = require("discord.js")



class stopmusic extends Command{


    constructor(client){

        super("stop","music",client)

        /**
         * 
         * @param {Discord.Message} msg 
         * @param {*} args 
         */

        this.cmd = async function(msg, args){

            if(!msg.guild) return 0;
            
            let userlang = msg.author.lang
            
            if(this.client.music.has(msg.guild.id)){
                
                if(!this.client.music.get(msg.guild.id).has_perm(msg)) return 0 

                this.client.music.get(msg.guild.id).connection.channel.leave()
                this.client.music.delete(msg.guild.id)

            }else{

                msg.channel.send(this.client.language.commands.music[userlang].notin_channel)

            }

        }

    }

}


module.exports = stopmusic