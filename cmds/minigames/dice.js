const Command = require("../../typedefs/Command");



class dice extends Command{

    constructor(client){

        super("dice","minigames",client);

        this.cmd = async function(msg,args){

            return msg.channel.send(this.lang[msg.author.lang].rolled + ` ${Math.floor(Math.random()*6)+1}`);

        };

        this.lang = {

            "zh_TW":
            {
                "rolled" : "你擲出了:"
            },
            "en_US":
            {
                "rolled" : "You rolled:"
            }

        }

    }

}

module.exports = dice