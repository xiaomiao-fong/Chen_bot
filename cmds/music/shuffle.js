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

                msg.channel.send(this.lang[userlang].notin_channel);

            }

        };

        this.lang = {

            "zh_TW":
            {
                "notin_channel" : "我目前沒有在語音頻道裡"
            },
            "en_US":
            {
                "notin_channel" : "I'm not in a voice channel right now."
            }

        };

    }

}

module.exports = shuffle;