const Event = require("../typedefs/Event");

class message extends Event{

    constructor(client){

        super("message",false,client)

        this.func = async function(msg){

            if(msg.content.startsWith(this.client.prefix)){

                let message_arr = msg.content.substring(3,msg.content.length).split(" ")
                let cmd = message_arr[0]
                if (cmd == undefined) return
                let args = message_arr.slice(1,message_arr.length)
        
                switch(await this.client.execute_command(msg,cmd,args)){
        
                    case 1:
                        msg.channel.send(`Can not find command \`\` ${cmd} \`\``)
                        break;
        
                }
        
            }else{
        
                console.log(msg.content)
        
            }
            
        }

    }

}

module.exports = message