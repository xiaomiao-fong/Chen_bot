const Command = require("../../typedefs/Command");
const Discord = require("discord.js")
const fs = require("fs")

class Help extends Command{

    constructor(client){

        super("help","util",client)

        /**
         * 
         * @param {Discord.Message} msg 
         * @param {*} args 
         * @returns 
         */

        this.cmd = async function(msg,args){

            let search = args[0]
            let userlang = msg.author.lang
            let lang = this.client.language
            //console.log(args)
            if(this.client.commands.has(search)){

                /** @type {Command} command */
                let command = this.client.commands.get(search)
                let embed = new Discord.MessageEmbed()
                embed.setAuthor(msg.author.username + "#" + msg.author.discriminator,msg.author.avatarURL())

                if(command.description !== undefined) embed.description = command.description[userlang]
                else{msg.channel.send(lang.commands.help[userlang].no_des); return;}

                embed.color = this.client.colors.red
                if(command.image != undefined) embed.setImage(command.image)

                let aliases = ""
                this.client.commands.get(search).aliases.forEach(aliase => {

                    aliases += (aliase + ", ")

                })

                aliases = aliases.substr(0,aliases.length-2)

                if(aliases === "") aliases = "**None**"

                embed.addField(lang.commands.help[userlang].aliases, aliases, true)


                msg.channel.send(embed)

            }else{

                if(this.client.groups.has(search)){

                    let des = lang.commands.help[userlang].group_cmds
                    let group = this.client.groups.get(search)

                    group.forEach(key=>{

                        des += ("-``"+key+"``\n")

                    })

                    des += lang.commands.help[userlang].cmd_name
                    let embed = new Discord.MessageEmbed()
                    embed.setAuthor(msg.author.username + "#" + msg.author.discriminator,msg.author.avatarURL())
                    embed.description = des
                    embed.color = this.client.colors.red

                    msg.channel.send(embed)

                }else{

                    if(search != undefined) msg.channel.send(lang.commands.help[userlang].cmd_nf)
                    let des = lang.commands.help[userlang].group_list
                    this.client.groups.keyArray().forEach(key=>{
                        if(!(key === "Owner")) des += ("-``"+key+"``\n")
                    })
                    des += lang.commands.help[userlang].group_name
                    let embed = new Discord.MessageEmbed()
                    embed.setAuthor(msg.author.username + "#" + msg.author.discriminator,msg.author.avatarURL())
                    embed.description = des
                    embed.color = this.client.colors.red

                    msg.channel.send(embed)

                }

            }

        }

    }


}

module.exports = Help
