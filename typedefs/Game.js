const Command = require("./Command");
const Discord = require("discord.js")
const Myclient = require("./client")


class two_p_Game{

    /**
     * 
     * @param {*} name 
     * @param {*} group 
     * @param {*} description 
     * @param {Myclient} client 
     */

    constructor(name,group,description,client){

        this.cmd;
        this.name = name;
        this.group = group;
        this.client = client
        this.description = description;
        this.aliases = []

    }
    
    /**
     * 
     * @param {Discord.Message} msg 
     * @param {String} gamename 
     * @param {*} mainfunc 
     */

    async invitegame(msg,gamename = this.name,mainfunc){

        let users_amount = 0;
        msg.mentions.users.each(user => users_amount++)

        /**
         * @type {Discord.User} iuser
         */
        let iuser;

        if(users_amount === 1){

            

            let bot = this.client
            iuser = msg.mentions.users.first()

            if(bot.check_playing(msg,iuser) === 0) return;

            bot.playing.set(msg.author.id,'Currently being invited')
            bot.playing.set(iuser.id,'Currently being invited')

            let inviter = await msg.author.send(`Sending ${gamename} invite to ${iuser.username}`)
            let invited = await iuser.send(`${msg.author} has sent you an ${gamename} invitation, would you like to accept it?`)
            
            const filter = (reaction,user) => {
                return ["✅","❎"].includes(reaction.emoji.name) && !user.bot
            }

            let invcollect = invited.createReactionCollector(filter,{time:30*1000})
            let accept = 0

            invited.react("✅")
            invited.react("❎")
            invcollect.once("collect", async function(reaction,user){
                switch(reaction.emoji.name){
                    case "✅":

                        accept = 2
                        msg.author.send("Invite accepted")
                        user.send("You accepted the invitation")
                        
                        bot.playing.set(msg.author.id,gamename)
                        bot.playing.set(iuser.id,gamename)
                        invcollect.stop()
                        break;

                    case "❎":

                        accept = 1
                        msg.author.send("Invite declined")
                        user.send("You declined the invitation")
                        
                        bot.playing.delete(msg.author.id)
                        bot.playing.delete(iuser.id)
                        invcollect.stop()
                        break;

                }
            })


            invcollect.on("end", (collected,reason) => {

                if(reason == "time") this.client.emit("game_end",msg.author,iuser)
                if(accept !== 2) return;
                mainfunc(msg,iuser,this.client);
                
            })

        }else if (users_amount === 0){

            return msg.channel.send("Please mention an person")

        }else{

            return msg.channel.send("Please don't mention more than one person")

        }   

    }

    async execute(msg,args){

        await this.cmd(msg,args)

    }


}


module.exports = two_p_Game