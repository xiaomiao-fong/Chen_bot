const Command = require("../../typedefs/Command");


class volume extends Command{

    constructor(client){

        super("volume", "music", client);

        this.aliases = ["vol"];

        this.cmd = async function(msg, args){

            if(!msg.guild) return 0;

            let userlang = msg.author.lang;
            let volume = 100

            try{

                volume = parseInt(args[0], 10);

            }catch(err){

                msg.channel.send(this.lang[userlang].invalid_arg);
                return;

            }

            if(!(volume <= 120 && volume >= 30)) {

                msg.channel.send(this.lang[userlang].invalid_arg);
                return;

            }
            
            if(this.client.music.has(msg.guild.id)){

                this.client.music.get(msg.guild.id).volume = volume/100;
                this.client.music.get(msg.guild.id).connection.dispatcher.setVolume(volume/100)
                msg.channel.send(this.lang[userlang].success.replace("{0}",volume));

            }else{

                msg.channel.send(this.lang[userlang].notin_channel);

            }

        };

        this.lang = {

            "zh_TW":
            {
                "notin_channel" : "我目前沒有在語音頻道裡",
                "invalid_arg" : "不正確的參數，範圍只能在30~120之間",
                "success" : "已將音量調整為 {0}%"
            },
            "en_US":
            {
                "notin_channel" : "I'm not in a voice channel right now.",
                "invalid_arg" : "Invalid argument, you can only type in a number range from 30 ~ 120",
                "success" : "The volume has been set to {0}%"
            }

        };

    }

}

module.exports = volume