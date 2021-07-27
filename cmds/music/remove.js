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

                    msg.channel.send(this.lang[userlang].invalid_arg);
                    return;

                }

                this.client.music.get(msg.guild.id).remove(msg,index);

            }else{

                msg.channel.send(this.lang[userlang].notin_channel);

            }

        };

        this.lang = {

            "zh_TW":
            {
                "notin_channel" : "我目前沒有在語音頻道裡",
                "invalid_arg" : "不正確的參數"
            },
            "en_US":
            {
                "notin_channel" : "I'm not in a voice channel right now.",
                "invalid_arg" : "Invalid argument(s)"
            }

        };

    }

}


module.exports = remove;