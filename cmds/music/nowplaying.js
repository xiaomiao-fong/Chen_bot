const Command = require("../../typedefs/Command");



class nowplaying extends Command{

    constructor(client){

        super("nowplaying","music",client);
        
        this.aliases = ["np"];

        this.cmd = async function(msg, args){

            if(!msg.guild) return 0;

            let userlang = msg.author.lang;
            
            if(this.client.music.has(msg.guild.id)){

                if(!this.client.music.get(msg.guild.id).current) return msg.channel.send(this.lang[userlang].not_playing);
                this.client.music.get(msg.guild.id).nowplaying(msg);

            }else{

                msg.channel.send(this.lang[userlang].not_playing);

            }

        };

        this.lang = {

            "zh_TW":
            {
                "not_playing" : "目前沒有音樂正在播放",
            },
            "en_US":
            {
                "not_playing" : "There's currently no song being played right now."
            }

        }

    }

}

module.exports = nowplaying;