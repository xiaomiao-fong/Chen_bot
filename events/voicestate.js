const Event = require("../typedefs/Event");
const Discord = require("discord.js")


class voicestateupdate extends Event{


    constructor(client){

        super("voiceStateUpdate",false,client)

        /**
         * @param {Discord.VoiceState} oldstate 
         * @param {Discord.VoiceState} newstate 
         */

        this.func = async function(oldstate, newstate){

            if(newstate.id === this.client.user.id){

                if (!newstate.connection) {

                    this.client.music.delete(newstate.guild.id)

                }else if(this.client.music.get(newstate.guild.id)){

                    this.client.music.get(newstate.guild.id).connection = newstate.connection

                }

            }

        }

    }

}

module.exports = voicestateupdate