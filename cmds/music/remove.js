const Command = require("../../typedefs/Command");


class remove extends Command{

    constructor(client){

        super("remove","music","remove a song from the queue",client)

        this.aliases = ["r"]

        this.cmd = async function(msg,args){

            if(!msg.guild) return 0;
            
            if(this.client.music.has(msg.guild.id)){

                let index = 1;

                try{

                    index = parseInt(args[0])

                }catch(err){

                    msg.channel.send("Invalid argument")
                    return;

                }

                this.client.music.get(msg.guild.id).remove(msg,index)

            }else{

                msg.channel.send("I'm not in a voice channel right now.")

            }

        }

    }

}


module.exports = remove