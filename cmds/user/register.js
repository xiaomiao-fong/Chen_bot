const Command = require("../../typedefs/Command");
const Discord = require("discord.js");


class register extends Command{

    constructor(client){

        super("register", "user", client);

        /**
         * 
         * @param {Discord.Message} msg 
         * @param {*} args 
         */

        this.cmd = async function(msg, args){

            let userlang = msg.author.lang;

            let name = args ? args[0] : msg.author.username;

            let sent = await msg.channel.send(this.lang[userlang].plz_wait);

            let user = await this.client.userdata.findOne({ where: { user_id : msg.author.id }});


            if(user){

                console.log(user);
                sent.edit(this.lang[userlang].registered);

            }else{

                let user = await this.client.userdata.create({

                    nickname : name,
                    user_id : msg.author.id

                });

                sent.edit(this.lang[userlang].succ_created);

            }

        };

        this.lang =
        {
            "zh_TW":
            {
                "registered" : "你已經註冊過了",
                "succ_created" : "成功註冊!",
                "plz_wait" : "請稍等..."
            },
            "en_US":
            {
                "registered" : "You have already registered.",
                "succ_created" : "You account has been created successfully.",
                "plz_wait" : "Please wait for a moment..."
            }

        };

    }

}

module.exports = register;