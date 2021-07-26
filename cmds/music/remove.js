const Command = require("../../typedefs/Command");


class remove extends Command{

    constructor(client){

        super("remove","music",client);

        this.aliases = ["r"];

        this.cmd = async function(msg,args){

            if(!msg.guild) return 0;

            let userlang = msg.author.lang;
            
            if(this.client.music.has(msg.guild.id)){

                let index = 1;

                try{

                    index = parseInt(args[0], 10);

                }catch(err){

                    msg.channel.send(this.client.language.commands.music[userlang].invalid_arg);
                    return;

                }

                this.client.music.get(msg.guild.id).remove(msg,index);

            }else{

                msg.channel.send(this.client.language.commands.music[userlang].notin_channel);

            }

        }

    }

}


module.exports = remove;