const Command = require("../../typedefs/Command");



class dice extends Command{

    constructor(client){

        super("dice","minigames","Randomly generates a number between 1~6",client)

        this.cmd = async function(msg,args){

            return msg.channel.send(`You rolled: ${Math.floor(Math.random()*6)+1}`)

        }

    }

}

module.exports = dice