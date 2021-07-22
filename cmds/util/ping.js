const Command = require("../../typedefs/Command");
const Discord = require("discord.js")


class ping extends Command{

    constructor(client){

        super("ping","util","Shows bot's ping",client)

        /**
         * 
         * @param {Discord.Message} msg 
         * @param {*} args 
         */

        this.cmd = async function(msg, args){

            msg.channel.send("Pinging...").then(sent => {

                sent.edit(`Ping ${sent.createdTimestamp - msg.createdTimestamp}ms`)

            })

        }

    }

}

module.exports = ping