const ytdl = require("ytdl-core");
const Command = require("../../typedefs/Command");


class testplay extends Command{

    constructor(client){

        super("testplay","owner",client)

        this.cmd = async function(msg, args){

            if(this.Is_Owner(msg.author)) return 0;

            let song = ytdl("https://www.youtube.com/watch?v=1DYNTizkBoM")

        }

    }

}

module.exports = testplay