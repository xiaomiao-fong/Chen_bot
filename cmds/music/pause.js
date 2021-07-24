const Command = require("../../typedefs/Command");


class pause extends Command{

    constructor(client){

        super("pause","music",client)

        this.cmd = async function(msg, args){

            if(!msg.guild) return 0;

            let userlang = "zh_TW"
            
            if(this.client.music.has(msg.guild.id)){

                this.client.music.get(msg.guild.id).pause(msg)

            }else{

                msg.channel.send(this.client.language.commands.music[userlang].notin_channel)

            }

        }

    }

}

module.exports = pause