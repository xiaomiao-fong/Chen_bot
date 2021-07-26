const Event = require("../typedefs/Event");


class Game_end extends Event{

    constructor(client){

        super("game_end", false, client);

        this.func = async function(user1, user2){

            this.client.playing.delete(user1.id);
            this.client.playing.delete(user2.id);
            console.log("success");

        };

    }

}


module.exports = Game_end;