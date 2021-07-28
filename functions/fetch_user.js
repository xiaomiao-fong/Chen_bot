const Discord = require("discord.js");
const Myclient = require("../typedefs/client")

/**
 * 
 * @param {Discord.Message} msg 
 * @param {*} args 
 * @param {Myclient} client 
 */

module.exports = async function(msg, args, client){

    if(msg.mentions.members.size > 0){

        return msg.mentions.members.first().user;

    }else{

        let id = args[0];

        if(id !== undefined){

            let user = client.users.cache.has(id) ? client.users.cache.get(id) : undefined;

            if(user) return user;
        
            return false;

        }

        return false;

    }

};