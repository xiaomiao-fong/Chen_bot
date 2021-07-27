const Command = require("../../typedefs/Command");



class showsongqueue extends Command{


    constructor(client){

        super("queue", "music", client);

        this.aliases = ["q"];

        this.cmd = async function(msg, args) {

            if(!msg.guild) return 0;

            let userlang = msg.author.lang;
            
            if(this.client.music.has(msg.guild.id)){

                this.client.music.get(msg.guild.id).sendqueue(msg);

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

        };

    }

}

module.exports = showsongqueue;