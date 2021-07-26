const Event = require("../typedefs/Event");



class ready extends Event{

    constructor(client){

        super("ready", true, client);

        this.func = async function(){

            console.log("ready");
            this.client.user.setPresence({"activity":{"name": this.client.prefix + "help", "type": "LISTENING"},"status" : "online"});

        };

    }


}

module.exports = ready;