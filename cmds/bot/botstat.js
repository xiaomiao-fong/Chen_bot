const Command = require("../../typedefs/Command");
const Discord = require("discord.js")

class status extends Command{

    constructor(client){

        super("botstat","bot",client)

        /**
         * 
         * @param {Discord.Message} msg 
         * @param {*} args 
         */

        this.cmd = async function(msg, args){

            let embed = new Discord.MessageEmbed()

            embed.title = "橙Chen"

            embed.setAuthor(this.client.user.username, this.client.user.avatarURL())
            embed.setColor(this.client.colors.red)
            embed.setFooter(`Executed by ${msg.author.username}`, msg.author.avatarURL())

            embed.addField("群組數/Group count: ", this.client.guilds.cache.size, true)
            embed.addField("總使用人數/Total Users: ", this.client.users.cache.size, true)

            msg.channel.send(embed)

        }

    }

}

module.exports = status