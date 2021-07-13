const discord = require('discord.js')

dict = {

    "yt" : {
        "command":async function(msg,client,args){

        if(msg.member.voice.channel){
            client.discordtogether.createTogetherCode(msg.member.voice.channelID, 'youtube').then(async invite =>{
                return msg.channel.send(`${invite.code}`)
            })
        }else{
            msg.channel.send("You must be in a voice channel to use this command.")
        }

    },"help" : {"des" : "Wanna watch youtube on discord w/ your friends? \nWell check out this function!"}
    },

    "fishing" : {
        "command" : async function(msg,client,args){

        if(msg.member.voice.channel){
            client.discordtogether.createTogetherCode(msg.member.voice.channelID,"fishing").then(async invite =>{
                return msg.channel.send(`${invite.code}`)
            })
        }

    },"help" : {"des" : "If you wanna go fishing w/ your friends but you cant go out, this small game will satisfy your requirements"}
    }

}

class_dict = {}

module.exports = {"mod" : dict,"modclass" : class_dict}