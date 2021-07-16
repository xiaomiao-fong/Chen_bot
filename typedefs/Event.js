const Myclient = require("./client")

class Event{

    /**
     * 
     * @param {String} name 
     * @param {Boolean} once 
     * @param {Myclient} client 
     * 
     */

    constructor(name,once,client){

        this.func;
        this.name = name;
        this.once = once;
        this.client = client

    }

}

module.exports = Event