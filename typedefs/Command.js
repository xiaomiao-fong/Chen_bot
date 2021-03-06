const Discord = require("discord.js");
const MyClient = require("./client")


class Command{

    /**
     * @param {String} name 
     * @param {String} group
     * @param {MyClient} client
     * @param {String} description 
     */

    constructor(name,group,client){

        this.cmd;
        this.name = name;
        this.group = group;
        /** @type {MyClient} this.client */
        this.client = client;
        this.description = "";
        this.availble = true;
        this.aliases = [];

    }

    /**
     * 
     * @param {Discord.User} user 
     * @returns 
     */

    Is_Owner(user){

        return user.id === this.client.owner;

    }


    /**
     * 
     * @param {Discord.Message} msg 
     * @param {MyClient} client 
     * @param {*} args 
     */

    async execute(msg,args){

        await this.cmd(msg,args);

    }

}

module.exports = Command;