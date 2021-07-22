const Command = require("../../typedefs/Command");


class Yt extends Command{

    constructor(client){
       
        super("yt","dctogether","Wanna watch youtube on discord w/ your friends? \nWell check out this function!",client)

        this.cmd = async function(msg,args){

            if(msg.member.voice.channel){
                this.client.discordtogether.createTogetherCode(msg.member.voice.channelID, 'youtube').then(async invite =>{
                    return msg.channel.send(`${invite.code}`)
                })
            }else{
                msg.channel.send("You must be in a voice channel to use this command.")
            }

        }

    }

}


module.exports = Yt