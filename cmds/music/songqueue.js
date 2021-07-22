const Command = require("../../typedefs/Command");



class showsongqueue extends Command{


    constructor(client){

        super('queue',"music","Shows current queue in the guild",client)

        this.cmd = async function(msg, args) {

            if(!msg.guild) return 0;
            
            if(this.client.music.has(msg.guild.id)){

                this.client.music.get(msg.guild.id).sendqueue(msg)

            }else{

                msg.channel.send("There's currently no song playing right now.")

            }

        }

    }

}

module.exports = showsongqueue