const Command = require("../../typedefs/Command");


class skipsong extends Command{

    constructor(client){

        super("skip","music", client)

        this.cmd = async function(msg, args){

            if(!msg.guild) return 0;

            let userlang = msg.author.lang
            
            if(this.client.music.has(msg.guild.id)){

                this.client.music.get(msg.guild.id).skip(msg)

            }else{

                msg.channel.send(this.client.language.commands.music[userlang].notin_channel)

            }

        }

    }

}

module.exports = skipsong