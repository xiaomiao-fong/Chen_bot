const Command = require("./Command");
const Discord = require("discord.js");
const Myclient = require("./client");


class Two_P_Game{

    /**
     * 
     * @param {*} name 
     * @param {*} group 
     * @param {*} description 
     * @param {Myclient} client 
     */

    constructor(name,group,client){

        this.cmd;
        this.name = name;
        this.group = group;
        this.client = client;
        this.description = "";
        this.aliases = [];

        this.invlang = {

            "zh_TW":
            {
                "sending_inv" : "發送 {0} 邀請給 ",
                "received_inv" : "{0} 邀請你一起玩 {1}，你要接受邀請嗎?",
                "accept_inv" : "對方已接受邀請",
                "accepted_inv" : "你接受了邀請",
                "decline_inv" : "對方拒絕你的邀請",
                "declined_inv" : "你拒絕了邀請",
                "mention_one" : "請標記一個人",
                "mention_less" : "請不要標記多於一個人",
                "being_invited" : "你現在正在邀請或被另一個人邀請",
                "you_playing" : "你現在正在遊玩",
                "target_invited" : " 正在邀請或被另一個人邀請",
                "target_playing" : " 現在正在遊玩 "
            },
            "en_US":
            {
                "sending_inv" : "Sending {0} invite to ",
                "received_inv" : "{0} has sent you a {1} invitation, would you like to accept it?",
                "accept_inv" : "Your invitation has been accepted.",
                "accepted_inv" : "You accepted the invitation.",
                "decline_inv" : "Your invitation has been declined.",
                "declined_inv" : "You declined the invitation.",
                "mention_one" : "Please mention an person.",
                "mention_less" : "Please don't mention more than one person.",
                "being_invited" : "You are currently inviting someone or being invited.",
                "you_playing" : "You are currently playing",
                "target_invited" : " is currently inviting someone or being invited.",
                "target_playing" : " is currently playing "
            }

        }

    }
    
    /**
     * 
     * @param {Discord.Message} msg 
     * @param {String} gamename 
     * @param {*} mainfunc 
     */

    async invitegame(msg,gamename = this.name,mainfunc){

        let User_Amount = 0;
        msg.mentions.users.each( (user) => User_Amount++);

        /**
         * @type {Discord.User} iuser
         */
        let iuser;

        let invlang = this.invlang[msg.author.lang];

        if(User_Amount === 1){

            let bot = this.client;
            iuser = msg.mentions.users.first();

            if(bot.Check_Playing(msg,iuser) === 0) return;

            bot.playing.set(msg.author.id,"Currently being invited");
            bot.playing.set(iuser.id,"Currently being invited");

            let inviter = await msg.author.send(invlang.sending_inv.replace("{0}", gamename) + ` ${iuser.username}`);
            let invited = await iuser.send(invlang.received_inv.replace("{0}",msg.author).replace("{1}",gamename));
            
            const filter = (reaction,user) => {
                return ["✅","❎"].includes(reaction.emoji.name) && !user.bot;
            }

            let invcollect = invited.createReactionCollector(filter,{time:30*1000});
            let accept = 0;

            invited.react("✅");
            invited.react("❎");
            invcollect.once("collect", async function(reaction,user){
                switch(reaction.emoji.name){
                    case "✅":

                        accept = 2;
                        msg.author.send(invlang.accept_inv);
                        user.send(invlang.accepted_inv);
                        
                        bot.playing.set(msg.author.id,gamename);
                        bot.playing.set(iuser.id,gamename);
                        invcollect.stop();
                        break;

                    case "❎":

                        accept = 1;
                        msg.author.send(userlang.decline_inv);
                        user.send(userlang.declined_inv);
                        
                        bot.playing.delete(msg.author.id);
                        bot.playing.delete(iuser.id);
                        invcollect.stop();
                        break;

                }
            })


            invcollect.on("end", (collected,reason) => {

                if(reason == "time") this.client.emit("game_end",msg.author,iuser);
                if(accept !== 2) return;
                mainfunc(msg,iuser,this.client,this.lang[msg.author.lang]);
                
            })

        }else if (User_Amount === 0){

            return msg.channel.send(invlang.mention_one);

        }else{

            return msg.channel.send(invlang.mention_less);

        }   

    }

    async execute(msg,args){

        await this.cmd(msg,args);

    }


}


module.exports = Two_P_Game;