const Command = require("../../typedefs/Command");


class setlang extends Command{

    constructor(client){

        super("setlang","user",client);

        this.cmd = async function(msg, args){

            let userlang = msg.author.lang;
            
            if(!args[0]) return msg.channel.send(this.lang[userlang].avail_lang);

            let lang = args[0]

            if(!['zh_TW', 'en_US'].includes(args[0])) return msg.channel.send(this.lang[userlang].avail_lang);
            if(msg.author.lang === lang) return msg.channel.send(this.lang[userlang].alr);

            let sent = await msg.channel.send(this.lang[userlang].plz_wait);
            let result = await this.client.userdata.update({ language : lang }, {where : { user_id : msg.author.id }});

            if(result > 0) {

                sent.edit(this.lang[userlang].success + lang);

            }else {

                sent.edit(this.lang[userlang].failed);

            }

        };

        this.lang = 
        {
            "zh_TW":
            {
                "avail_lang" : "目前可以選擇的語言有: [zh_TW / en_US]",
                "success" : "你的語言已成功設定為 ",
                "failed" : "語言更改失敗，請確認是否有註冊過(register 指令)",
                "plz_wait" : "請稍等...",
                "alr" : "你已經是這個語言了"
            },
            "en_US":
            {
                "avail_lang" : "Available languages : [zh_TW / en_US]",
                "success" : "Your language has been successfully set to ",
                "failed" : "Failed to change your language setting, please check if you have registered (register command)",
                "plz_wait" : "Please wait for a moment...",
                "alr" : "You are already using this language."
            }

        };

    }

}

module.exports = setlang;