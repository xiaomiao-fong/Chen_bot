const Command = require("../../typedefs/Command");



class dice extends Command{

    constructor(client){

        super("dice","minigames",client);

        this.cmd = async function(msg,args){

            let userlang = msg.author.lang;
            return msg.channel.send(this.client.language.commands.game[userlang].rolled + ` ${Math.floor(Math.random()*6)+1}`);

        };

    }

}

module.exports = dice