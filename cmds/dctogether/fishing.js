const Command = require("../../typedefs/Command");


class fishing extends Command{


    constructor(client){

        super("fishing","dctogether",client);

        this.cmd = async function(msg,args){

            if(msg.member.voice.channel){
                this.client.discordtogether.createTogetherCode(msg.member.voice.channelID,"fishing").then(async invite =>{
                    return msg.channel.send(`${invite.code}`);
                });
            }else{
                msg.channel.send("You must be in a voice channel to use this command.");
            }
        }

    }

}

module.exports = fishing;