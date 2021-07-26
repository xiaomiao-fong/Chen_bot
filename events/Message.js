const Event = require("../typedefs/Event");

class message extends Event{

    constructor(client){

        super("message",false,client);

        this.func = async function(msg){

            let lang = 
            {
                "zh_TW" : "找不到指令 ",
                "en_US" : "Can not find command "
            }

            msg.author.lang = await this.fetchlang(msg);

            if(msg.content.startsWith(this.client.prefix)){

                let Message_Arr = msg.content.replace(this.client.prefix,"").split(" ");
                let cmd = Message_Arr[0];
                if (cmd == undefined) return;
                let args = Message_Arr.slice(1,Message_Arr.length);
        
                switch(await this.client.Execute_Command(msg,cmd,args)){
        
                    case 1:
                        msg.channel.send(lang[msg.author.lang] + `\`\` ${cmd} \`\``);
                        break;
        
                }
        
            }else{
        
                console.log(msg.content);
        
            }
            
        };

        this.fetchlang = async function(msg){

            let user = await this.client.userdata.findOne({where : { user_id : msg.author.id}});

            if(!user){
                
                return "zh_TW";

            }else{

                return user.get("language");
            }

        }

    }

}

module.exports = message;