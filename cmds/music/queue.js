const Command = require("../../typedefs/Command");



class showsongqueue extends Command{


    constructor(client){

        super('queue',"music",client)

        this.aliases = ["q"]

        this.cmd = async function(msg, args) {

            if(!msg.guild) return 0;

            let userlang = "zh_TW"
            
            if(this.client.music.has(msg.guild.id)){

                this.client.music.get(msg.guild.id).sendqueue(msg)

            }else{

                msg.channel.send(this.client.language.commands.music[userlang].not_playing)

            }

        }

    }

}

module.exports = showsongqueue