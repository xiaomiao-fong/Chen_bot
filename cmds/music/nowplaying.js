const Command = require("../../typedefs/Command");



class nowplaying extends Command{

    constructor(client){

        super("nowplaying","music",client)
        
        this.aliases = ["np"]

        this.cmd = async function(msg, args){

            if(!msg.guild) return 0;

            let userlang = "zh_TW"
            
            if(this.client.music.has(msg.guild.id)){

                if(!this.client.music.get(msg.guild.id).current) return msg.channel.send(this.client.language.commands.music[userlang].not_playing)
                this.client.music.get(msg.guild.id).nowplaying(msg)

            }else{

                msg.channel.send(this.client.language.commands.music[userlang].not_playing)

            }

        }

    }

}

module.exports = nowplaying