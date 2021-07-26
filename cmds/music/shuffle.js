const Command = require("../../typedefs/Command");



class shuffle extends Command{

    constructor(client){

        super("shuffle","music",client);

        this.cmd = async function(msg,args){

            if(!msg.guild) return 0;

            let userlang = msg.author.lang;
            
            if(this.client.music.has(msg.guild.id)){

                this.client.music.get(msg.guild.id).shuffle(msg);

            }else{

                msg.channel.send(this.client.language.commands.music[userlang].notin_channel);

            }

        }

    }

}

module.exports = shuffle;