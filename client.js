const Discord = require('discord.js')
const fs = require('fs')


class client extends Discord.Client{

    constructor(owner,dctogether){

        super()

        this.discordtogether = new dctogether(this)
        this.Group_cmds = {}
        this.cmd_record = {}
        this.Group_classes = {}
        this.owner = owner
        this.cooldown = new Discord.Collection();
        this.playing = new Discord.Collection();
        this.invlink = "https://discord.com/api/oauth2/authorize?client_id=735804773864833065&permissions=4025876289&scope=bot"
        this.colors = {
            "red" : 0xF00303,
            "yellow" : 0xFFE100,
            "cyan" : 0x1DC9D6,
            "black" : 0x000000,
            "white" : 0xF0F0F0
        }

        fs.readdir("./cmds", (err, files) => {

            let cmdnames, cmdfuncs

            files.forEach(file => {
    
                let {mod, modclass} = require(`./cmds/${file}`)
                file = file.replace(".js","")
                console.log(file)
                cmdnames = Object.keys(mod)
                cmdfuncs = Object.values(mod)
                for(let i = 0; i < cmdnames.length;i++){
                    this.Group_cmds[cmdnames[i]] = cmdfuncs[i]
                }
                this.cmd_record[file] = cmdnames  
                this.Group_classes[file] = modclass
    
            })
            
        })

        this.Group_cmds["help"] = {}
        this.Group_cmds["help"].command = async function(msg,client,args){

            let search = args[0]
            if(Object.keys(client.Group_cmds).includes(search)){

                let helpobj = client.Group_cmds[search].help
                let embed = new Discord.MessageEmbed()
                embed.setAuthor(msg.author.username)
                try{
                    embed.description = helpobj.des
                }catch{
                    msg.channel.send("This command does not have a description")
                    return
                }
                embed.color = client.colors.red
                if(helpobj.image != undefined) embed.setImage(helpobj.image)

                msg.channel.send(embed)

            }else{

                fs.readdir("./cmds", (err, files)=>{

                    if(files.includes((search+".js"))){

                        let des = "Here are a list of commands of this command group:\n"
                        let {mod,modclass} = require(`./cmds/${search}.js`)
                        Object.keys(mod).forEach(key=>{

                            des += ("-``"+key+"``\n")

                        })
                        des += "\nDo cn!help ``command name`` for more information!"
                        let embed = new Discord.MessageEmbed()
                        embed.setAuthor(msg.author.username)
                        embed.description = des
                        embed.color = client.colors.red

                        msg.channel.send(embed)
                    }else{

                        if(search != undefined) msg.channel.send("Cannot find the command you are looking for. But here's a list of command groups you can check out!")
                        let des = "List of command groups:\n"
                        files.forEach(file=>{
                            des += ("-``"+file.replace(".js","")+"``\n")
                        })
                        des += "\nDo cn!help ``command_group_name`` for more informations!"
                        let embed = new Discord.MessageEmbed()
                        embed.setAuthor(msg.author.username)
                        embed.description = des
                        embed.color = client.colors.red

                        msg.channel.send(embed)

                    }

                })

            }

        }

        this.Group_cmds["reload"] = {}
        this.Group_cmds["reload"].command = async function(msg, client, args){

            if (msg.author.id != client.owner.id) return msg.channel.send("Only the owner of this robot can use this command")
            let target = args[0]

            fs.readdir("./cmds", (err, files) =>{

                if(target!==undefined && files.includes(target+".js")){

                    console.log(require.resolve(`./cmds/${target}.js`))
                    delete require.cache[require.resolve(`./cmds/${target}.js`)]

                    client.cmd_record[target].forEach(fn => {
                        
                        client.Group_cmds[fn] = null

                    });


                    let {mod,modclass} = require(`./cmds/${target}.js`)

                    let cmdnames = Object.keys(mod)
                    let cmdfuncs = Object.values(mod)
                    for(let i = 0; i < cmdnames.length;i++){
                        client.Group_cmds[cmdnames[i]] = cmdfuncs[i]
                    }

                    client.cmd_record[target] = cmdnames
                    client.Group_classes[target] = modclass

                    msg.channel.send(`module \`\`${target}\`\` reloaded sucessfully`)

                }else{

                    msg.channel.send(`Cannot find module \`\`${target}\`\``)

                }

            })

        }

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

}


module.exports = client
