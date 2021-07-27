

module.exports = async function(msg, client, cmd){

    if(client.commands.has(cmd)){
        
        return client.commands.get(cmd)

    }else{

        let find = false
        let command;

        Array.from(client.commands.values()).forEach((tempcmd) => {

            tempcmd.aliases.forEach(async (aliase) => {

                if(cmd === aliase){

                    find = true;
                    command = tempcmd;

                }

            })

        })

        if(find) return command;
        return false

    }

}