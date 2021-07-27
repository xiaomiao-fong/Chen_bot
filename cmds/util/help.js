const Command = require("../../typedefs/Command");
const Discord = require("discord.js");
const fs = require("fs");

class Help extends Command{

    constructor(client){

        super("help","util",client);

        /**
         * 
         * @param {Discord.Message} msg 
         * @param {*} args 
         * @returns 
         */

        this.cmd = async function(msg,args){

            let search = args[0];
            let lang = this.lang[msg.author.lang]
            //console.log(args)
            if(this.client.commands.has(search)){

                /** @type {Command} command */
                let command = this.client.commands.get(search);
                let embed = new Discord.MessageEmbed();
                embed.setAuthor(msg.author.username + "#" + msg.author.discriminator,msg.author.avatarURL());

                if(command.description !== undefined) embed.description = command.description[msg.author.lang];
                else{msg.channel.send(lang.no_des); return;}

                embed.color = this.client.colors.red;
                if(command.image != undefined) embed.setImage(command.image);

                let aliases = "";
                this.client.commands.get(search).aliases.forEach( (aliase) => {

                    aliases += (aliase + ", ");

                })

                aliases = aliases.substr(0,aliases.length-2);

                if(aliases === "") aliases = "**None**";

                embed.addField(lang.aliases, aliases, true);


                msg.channel.send(embed);

            }else{

                if(this.client.groups.has(search)){

                    let des = lang.group_cmds;
                    let group = this.client.groups.get(search);

                    group.forEach( (key) =>{

                        des += ("-``"+key+"``\n");

                    })

                    des += lang.cmd_name;
                    let embed = new Discord.MessageEmbed();
                    embed.setAuthor(msg.author.username + "#" + msg.author.discriminator,msg.author.avatarURL());
                    embed.description = des;
                    embed.color = this.client.colors.red;

                    msg.channel.send(embed);

                }else{

                    if(search != undefined) msg.channel.send(lang.cmd_nf);
                    let des = lang.group_list;
                    this.client.groups.keyArray().forEach( (key) =>{
                        if(!(key === "Owner")) des += ("-``"+key+"``\n");
                    })
                    des += lang.group_name;
                    let embed = new Discord.MessageEmbed();
                    embed.setAuthor(msg.author.username + "#" + msg.author.discriminator,msg.author.avatarURL());
                    embed.description = des;
                    embed.color = this.client.colors.red;

                    msg.channel.send(embed);

                }

            }

        };

        this.lang = {

            "zh_TW":
            {
                "no_des" : "這個指令沒有說明",
                "aliases" : "別名",
                "group_cmds" : "這裡是這個分類的所有指令:\n\n",
                "cmd_name" : "\n使用 ``cn!help {指令名} `` 以獲得更多有關指令的訊息!",
                "cmd_nf" : "找不到你指定的指令，以下是所有可以查詢的指令分類:",
                "group_list" : "這裡是所有可以查詢的分類:\n\n",
                "group_name" : "\n使用 ``cn!help {分類名} `` 以獲得這個分類的所有指令!"
            },
            "en_US":
            {
                "no_des" : "This command does not have a description.",
                "aliases" : "aliases",
                "group_cmds" : "Here are a list of commands of this command group:\n\n",
                "cmd_name" : "\nDo cn!help ``{command name}`` for more information!",
                "cmd_nf" : "Cannot find the command you are looking for. But here's a list of command groups you can check out!",
                "group_list" : "List of command groups:\n\n",
                "group_name" : "\nDo cn!help ``{command_group_name}`` for more informations!"
            }

        };

    }

}

module.exports = Help;
