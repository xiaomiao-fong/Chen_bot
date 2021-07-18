const Command = require("../typedefs/Command");
const Discord = require("discord.js");
const ytdl = require("ytdl-core")
const ytsr = require("ytsr")
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require("fluent-ffmpeg")
const PassThrough = require("stream").PassThrough
ffmpeg.setFfmpegPath(ffmpegPath)


class play extends Command{

    constructor(client){

        super("play","music","Use this command to play music!",client)

        /**
         * 
         * @param {Discord.Message} msg 
         * @param {any[]} args 
         */
        
        this.cmd = async function(msg,args){

            let status = 1;

            if(!this.client.music.has(msg.guild.id)){

                let joincls = require("./join");
                let joincmd = new joincls(this.client)

                await joincmd.execute(msg,args)

            }

            if(this.client.music.has(msg.guild.id)){

                let search = args.join(' ')

                if(!search){

                    msg.channel.send("Missing argument")
                    return 0;
        
                }

                if(!this.client.music.get(msg.guild.id).has_perm(msg)) return 0 
        
                let url;
        
                if(!ytdl.validateURL(search)){
        
                    msg.channel.send(`Searching \`\`${search}\`\``)
                    let searchresult = await ytsr(search)
                    let first = searchresult.items[0]
        
                    url = first.url;
        
                }else{
        
                    url = search
        
                }
        
                console.log(url)
        
                let song = new PassThrough({
                    highWaterMark : 12
                })
                
                let process = ffmpeg(ytdl(url ,{filter : "audioonly" }))

                process.addOptions(['-ac','2','-f','opus','-ar','48000'])
                process.on("error",(err) => {
                    if(err == "Output Stream Closed") return;
                    console.log("Error: " + err.message)
                })

                process.writeToStream(song, {

                    end : true

                })
        
                let songinfo = await ytdl.getInfo(url)

                let time = new Date(0);
                time.setSeconds(parseInt(songinfo.videoDetails.lengthSeconds));
                let timeString = time.toISOString().substr(11, 8);
        
                let music = { "song" : song,
                              "channel" : songinfo.videoDetails.author.name,
                              "channel_url" : songinfo.videoDetails.author.user_url,
                              "channel_avatar" : songinfo.videoDetails.author.thumbnails[0].url,
                              "songname" : songinfo.videoDetails.title,
                              "length" : timeString,
                              "thumbnail" : songinfo.videoDetails.thumbnails[0].url,
                              "url" : url}

                this.client.music.get(msg.guild.id).play(msg,music)

            }

        }

    }

}

module.exports = play