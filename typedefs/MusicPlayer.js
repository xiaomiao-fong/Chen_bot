const Discord = require("discord.js")
const Myclient = require("./client")
const MusicQueue = require("./Queue")


class MusicPlayer{

    /**
     * 
     * @param {Myclient} client 
     * @param {Discord.VoiceConnection} connection 
     */

    constructor(client,connection){

        this.client = client;
        this.connection = connection;
        this.queue = new MusicQueue();
        this.current = undefined;
        this.playing = false;

    }

    /**
     * 
     * @param {Discord.Message} msg 
     * @param {*} arg 
     */

    has_perm(msg){

        if(!this.connection.voice.channel.members.has(msg.author.id)){

            msg.channel.send("You have to be in the same channel to use this command.")
            return false

        }

        return true

    }
    
    async play(msg,music){
        
        if(this.queue.empty()){
  
            this.current = music;
            this.queue.add(music)
            this.playsong(msg,music)

        }else{

            this.queue.add(music)
            msg.channel.send(`Added \`\`${music.songname}\`\` to queue`)

        }


    }

    async playsong(msg,music){

        this.nowplaying(msg,music)
        let dispatcher = await this.connection.play(music.song)

        dispatcher.on("finish", () => {

            let nextsong = this.queue.next()
            if(nextsong) this.playsong(msg,nextsong)

        })


    }

    /**
     * 
     * @param {Discord.Message} msg 
     * @param {*} music 
     */

    async nowplaying(msg,music = this.current){

        let embed = new Discord.MessageEmbed();

        embed.setAuthor(music.channel,music.channel_avatar,music.channel_url)
        embed.setFooter(msg.author.username,msg.author.avatarURL)
        embed.setThumbnail(music.thumbnail.url)
        embed.addField("Now playing: ", `[${music.songname}](${music.url})`,true)
        embed.addField("Length: ", music.length)

        await msg.channel.send(embed)

    }

    /**
     * 
     * @param {Discord.Message} msg 
     * @returns 
     */

    async sendqueue(msg){

        if(this.queue.empty() && !this.current){

            this.nowplaying(msg)
            await msg.channel.send("The Queue is empty, type cn!play [url/keyword] to add songs to queue!")
            return 0;

        }

        let embed = new Discord.MessageEmbed()
        embed.setAuthor(msg.author.username,msg.author.avatarURL)
        
        let text = `**Now playing**: [${this.current.songname}](${this.current.url}) | \`\`${this.current.length}\`\` \n\n`;
        let loop = 0;

        this.queue.queue.forEach(music => {

            if(loop !== 0) {

                text += `${loop}. ${music.songname} | \`\`${music.length}\`\` \n\n`
                
            }
            
            loop++

        })

        embed.title = `${msg.guild.name}'s  Music Queue`
        embed.description = text;
        
        msg.channel.send(embed)
        return 0;

    }

    async skip(msg){

        if(!this.has_perm(msg)) return

        msg.channel.send(`Successfully skipped \`\`${this.current.songname}\`\``)
        this.connection.dispatcher.end()

    }

    async remove(msg,index){

        if(!this.has_perm(msg)) return

        let removed = this.queue.remove(index)
        if(removed === "Not found") return msg.channel.send(`Can't find song at index ${index}`)
        msg.channel.send(`Successfully removed \`\`${removed.songname}\`\``)

    }

}

module.exports = MusicPlayer