const Command = require("../../typedefs/Command");


class loop extends Command{

    constructor(client){

        super("loop", "music", client)

        this.cmd = async function(msg, args){

            if(!msg.guild) return 0;

            let userlang = msg.author.lang

            if(this.client.music.has(msg.guild.id)){

                let loop = this.client.music.get(msg.guild.id).loop
                this.client.music.get(msg.guild.id).loop = !loop

                if(!loop) return msg.channel.send(this.lang[userlang].success_open)
                msg.channel.send(this.lang[userlang].success_close)

            }else{

                msg.channel.send(this.lang[userlang].notin_channel);

            }

        };

        this.lang = {

            "zh_TW":
            {
                "notin_channel" : "我目前沒有在語音頻道裡",
                "invalid_arg" : "不正確的參數，範圍只能在30~120之間",
                "success_open" : "已將清單循環開啟!",
                "success_close" : "已將清單循環關閉!"
            },
            "en_US":
            {
                "notin_channel" : "I'm not in a voice channel right now.",
                "invalid_arg" : "Invalid argument, you can only type in a number range from 30 ~ 120",
                "success_open" : "The queue will now be looped",
                "success_close" : "The queue will now not be looped"
            }

        };

    }

}

module.exports = loop