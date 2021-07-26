const Command = require("../../typedefs/Command");



class reload extends Command{

    constructor(client){

        super('reload',"Owner",client)

        this.cmd = async function(msg,args){

            let target = args[0]

            if(msg.author.id !== this.client.owner.id) {
                msg.channel.send("Only the owner can use this command")
                return 0;
            }

            if(target === undefined) {
                msg.channel.send("Missing argument")
                return 0;
            }

            let group;

            try
            {
                group = this.client.commands.get(target).group
                console.log(group)
                console.log(require.resolve(`../${group}/${target}.js`))
            }
            catch(err)
            {
                msg.channel.send(`Can't find command \`\`${target}\`\`. `)
                return 0;
            }
            
            delete require.cache[require.resolve(`../${group}/${target}.js`)]

            let commandcls = require(`../${group}/${target}.js`)
            let command = new commandcls(this.client)

            this.client.commands.set(command.name,command)

            msg.channel.send(`Command \`\`${target}\`\` has been reloaded successfully`)

        }

    }

}


module.exports = reload