const Command = require("../../typedefs/Command");
const Discord = require("discord.js");



class stopmusic extends Command{


    constructor(client){

        super("stop","music",client);

        /**
         * 
         * @param {Discord.Message} msg 
         * @param {*} args 
         */

        this.cmd = async function(msg, args){

            if(!msg.guild) return 0;
            
            let userlang = msg.author.lang;
            
            if(this.client.music.has(msg.guild.id)){
                
                if(!this.client.music.get(msg.guild.id).Has_Perm(msg)) return 0 ;

                this.client.music.get(msg.guild.id).connection.channel.leave();
                this.client.music.delete(msg.guild.id);

            }else{

                msg.channel.send(this.lang[userlang].notin_channel);

            }

        };

        this.lang = {

            "zh_TW":
            {
                "notin_channel" : "我目前沒有在語音頻道裡"
            },
            "en_US":
            {
                "notin_channel" : "I'm not in a voice channel right now."
            }

        };

    }

}


module.exports = stopmusic;