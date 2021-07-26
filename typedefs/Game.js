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

    }
    
    /**
     * 
     * @param {Discord.Message} msg 
     * @param {String} gamename 
     * @param {*} mainfunc 
     */

    async invitegame(msg,gamename = this.name,mainfunc){

        let users_amount = 0;
        let userlang = msg.author.lang;
        msg.mentions.users.each(user => users_amount++);

        /**
         * @type {Discord.User} iuser
         */
        let iuser;

        let invlang = this.client.language.commands.invite[userlang];

        if(users_amount === 1){

            let bot = this.client;
            iuser = msg.mentions.users.first();

            if(bot.check_playing(msg,iuser,invlang) === 0) return;

            bot.playing.set(msg.author.id,'Currently being invited');
            bot.playing.set(iuser.id,'Currently being invited');

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
                mainfunc(msg,iuser,this.client);
                
            })

        }else if (users_amount === 0){

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