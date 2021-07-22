const Command = require("../../typedefs/Command");



class shuffle extends Command{

    constructor(client){

        super("shuffle","music","Shuffles the current queue",client)

        this.cmd = async function(msg,args){

            if(!msg.guild) return 0;
            
            if(this.client.music.has(msg.guild.id)){

                this.client.music.get(msg.guild.id).shuffle(msg)

            }else{

                msg.channel.send("I'm not in a voice channel right now.")

            }

        }

    }

}

module.exports = shuffle