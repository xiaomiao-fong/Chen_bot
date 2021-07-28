const Discord = require("discord.js");
const Command = require("../../typedefs/Command");


class avatar extends Command{

    constructor(client){

        super("avatar", "user", client)

        /**
         * 
         * @param {Discord.Message} msg 
         * @param {*} args 
         * @returns 
         */

        this.cmd = async function(msg, args){

            if(!msg.guild) return 0;

            let fetch_user = require("../../functions/fetch_user.js")
            let user = await fetch_user(msg, args, this.client)

            if(!user) user = msg.author

            let embed = new Discord.MessageEmbed()

            embed.title = `${user.username}'s avatar`
            embed.setImage(user.avatarURL({format : "png", dynamic : true, size : 2048})) 
                 .setColor(this.client.colors.red)

            msg.channel.send(embed)

        };

    }

}

module.exports = avatar