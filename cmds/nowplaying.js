const Command = require("../typedefs/Command");



class nowplaying extends Command{

    constructor(client){

        super("nowplaying","music","Show's the current song that is being played",client)

        this.cmd = async function(msg, args){

            if(!msg.guild) return 0;
            
            if(this.client.music.has(msg.guild.id)){

                this.client.music.get(msg.guild.id).nowplaying(msg)

            }else{

                msg.channel.send("I'm not in a voice channel right now.")

            }

        }

    }

}

module.exports = nowplaying