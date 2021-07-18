const Discord = require('discord.js')
const fs = require('fs');
const Command = require('./Command');


class client extends Discord.Client{

    constructor(owner,dctogether,prefix){

        super()

        this.discordtogether = new dctogether(this)
        this.owner = owner
        this.prefix = prefix

        this.commands = new Discord.Collection();// commands
        this.groups = new Discord.Collection();//command groups
        this.cooldown = new Discord.Collection();//cooldown
        this.playing = new Discord.Collection();//game
        this.music = new Discord.Collection();//music

        this.invlink = "https://discord.com/api/oauth2/authorize?client_id=735804773864833065&permissions=4025876289&scope=bot"
        this.colors = {
            "red" : 0xF00303,
            "yellow" : 0xFFE100,
            "cyan" : 0x1DC9D6,
            "black" : 0x000000,
            "white" : 0xF0F0F0
        }

        fs.readdir("./cmds", (err, files) => {
            
            files.forEach(file => {

                let commandcls = new require(`../cmds/${file}`)
                let command = new commandcls(this)
                
                this.commands.set(command.name,command)
                if(!this.groups.has(command.group)) this.groups.set(command.group,[]);
                this.groups.get(command.group).push(command.name)
    
            })

            console.log(this.groups)
            
        })    
    }

    EmbedMaker(msg,description,color,fields){

        let embed = new Discord.MessageEmbed();
        embed.setAuthor(msg.author.username + "#" + msg.author.discriminator, msg.author.avatarURL)
        embed.description = description;
        embed.color = color
        embed.setFooter(`Bot made by: ${this.owner.name}`,this.owner.avatar)
        if (fields!=undefined) embed.addFields(fields)

        return embed

    }

    stopgame(collector1, collector2){

        collector1.stop()
        collector2.stop()

    }

    /**
     * @param {Discord.Message} msg
     * @param {Discord.User} iuser 
     * @returns 
     */

    check_playing(msg,iuser){

        let bot = this

        if(bot.playing.has(msg.author.id)){

            if(bot.playing.get(msg.author.id) === "Currently being invited") 
            {
                msg.channel.send("You are currently inviting someone or being invited.")
                return 0;
            }

            msg.channel.send(`You are currently playing ${bot.playing.get(msg.author.id)}`)
            return 0;

        }

        if(iuser == undefined) return 1;

        
        if(bot.playing.has(iuser.id)){

            if(bot.playing.get(msg.author.id) === "Currently being invited") 
            {
                msg.channel.send(`${iuser.username} is currently inviting someone or being invited.`)
                return 0;
            }

            msg.channel.send(`${iuser.username} is currently playing ${bot.playing.get(iuser.id)}`)
            return 0;

        }

        return 1

    }

    /**
     * 
     * @param {Discord.Message} msg 
     * @param {String} gamename 
     * @param {*} mainfunc 
     */

    async invitegame(msg,gamename,mainfunc){

        let users_amount = 0;
        msg.mentions.users.each(user => users_amount++)


        /**
         * @type {Discord.User} iuser
         */
        let iuser;

        if(users_amount === 1){

            let bot = this
            iuser = msg.mentions.users.first()

            if(this.check_playing(msg,iuser) === 0) return;

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
                if(reason == "time") this.emit("game_end",msg.author,iuser)
                mainfunc(msg,accept,iuser);
            })

        }else if (users_amount === 0){

            return msg.channel.send("Please mention an person")

        }else{

            return msg.channel.send("Please don't mention more than one person")

        }   

    }

    async execute_command(msg,cmd,args){

        let client = this

        if(cmd != undefined){

            if(client.cooldown.get(msg.author.id) > 3){
            
                msg.channel.send("Please slowdown.")
                return 0;
    
            }
    
            if(client.commands.has(cmd)){
    
                if (!client.cooldown.has(msg.author.id)) 
                {
                    client.cooldown.set(msg.author.id,1)
                    console.log(client.cooldown.get(msg.author.id))
                }else
                {
                    client.cooldown.set(msg.author.id,client.cooldown.get(msg.author.id) + 1)
                    console.log(client.cooldown.get(msg.author.id))
                }
    
                await client.commands.get(cmd).execute(msg,args)
                    .then(() => {
                        setTimeout(() => {
                            client.cooldown.set(msg.author.id,client.cooldown.get(msg.author.id) - 1)
                        } , 7000)
                        console.log("executed")
                    })
                    .catch(reason =>{
                        client.channels.cache.get("866296391281803274").send(
                            `\`\`-ERROR-\`\` \nThe command \`\`${cmd}\`\` is executed by user ${msg.author.username}#${msg.author.discriminator}\nError reason:\n\`\`\`js\n${reason}\n\`\`\``)
                    })
                
                
    
                return 0
            }
    
            return 1
        }
    
        return 0    

    }

}


module.exports = client
