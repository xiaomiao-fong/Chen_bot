const Command = require("../../typedefs/Command");



class dice extends Command{

    constructor(client){

        super("dice","minigames",client)

        this.cmd = async function(msg,args){

            return msg.channel.send(`You rolled: ${Math.floor(Math.random()*6)+1}`)

        }

    }

}

module.exports = dice