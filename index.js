const Discord = require('discord.js')
const Myclient = require('./client')
const Dt = require('discord-together')
const {token, prefix, owner} = require('./config.json')

const client = new Myclient(owner,Dt.DiscordTogether)

/**
 * @param {Discord.Message} msg - the original message.
 */
    
async function exe_cmd(msg,cmd,args){


    if(cmd != undefined){

        if(client.cooldown.get(msg.author.id) > 3){
        
            msg.channel.send("Please slowdown.")
            return 0;

        }

        if(Object.keys(client.Group_cmds).includes(cmd)){

            if (!client.cooldown.has(msg.author.id)) 
            {
                client.cooldown.set(msg.author.id,1)
                console.log(client.cooldown.get(msg.author.id))
            }else{
                client.cooldown.set(msg.author.id,client.cooldown.get(msg.author.id) + 1)
                console.log(client.cooldown.get(msg.author.id))
            }

            let execution = new Promise(async function(resolve,reject){

                await client.Group_cmds[cmd].command(msg,client,args)
                resolve()
                
            })
            
            execution.then(()=>{

                setTimeout(() => {
                    client.cooldown.set(msg.author.id,client.cooldown.get(msg.author.id) - 1)
                } , 7000)
                console.log("executed")

            });

            return 0
        }

        return 1
    }

    return 0

}


client.on('game_end', (member1,member2)=>{

    client.playing.delete(member1.id)
    client.playing.delete(member2.id)

})


client.once('ready', () => {
    console.log("ready")
    client.user.setPresence({"activity":{"name":"cn!help", "type": "LISTENING"},"status" : "online"})
})

client.on('message', async msg => {
    if(msg.content.startsWith(prefix)){

        message_arr = msg.content.substring(3,msg.content.length).split(" ")
        cmd = message_arr[0]
        if (cmd == undefined) return
        args = message_arr.slice(1,message_arr.length)

        switch(await exe_cmd(msg,cmd,args)){

            case 1:
                msg.channel.send(`Can not find command \`\` ${cmd} \`\``)
                break;

        }

    }else{

        console.log(msg.content)

    }
})

client.login(token)











