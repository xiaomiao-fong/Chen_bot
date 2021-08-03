const Discord = require("discord.js");
const Myclient = require("./client");
const MusicQueue = require("./Queue");
const PassThrough = require("stream").PassThrough;
const ytdl = require("ytdl-core");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);


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
        this.volume = 0.5;
        this.current = undefined;
        this.playing = false;
        this.loop = false;
        this.lang = this.client.language.commands.music;

    }

    /**
     * 
     * @param {Discord.Message} msg 
     * @param {*} arg 
     */

    Has_Perm(msg){

        let userlang = msg.author.lang;
        if(!this.connection.voice.channel.members.has(msg.author.id)){

            msg.channel.send(this.lang[userlang].same_channel);
            return false;

        }

        return true;

    }
    
    async play(msg, url, loop = false){
        
        let userlang = msg.author.lang;

        let song = new PassThrough({
            highWaterMark : 12
        });
        
        let process = ffmpeg(ytdl(url ,{filter : "audioonly" }));

        process.addOptions(['-ac','2','-f','opus','-ar','48000']);
        process.on("error",(err) => {
            if(err == "Output Stream Closed") return;
            console.log("Error: " + err.message);
            msg.channel.send("Error occurred.");
        })

        process.writeToStream(song, {

            end : true

        });

        let songinfo = await ytdl.getInfo(url);

        let timeString = await this.client.secondtohhmmss(songinfo.videoDetails.lengthSeconds);

        let music = { "song" : song,
                      "channel" : songinfo.videoDetails.author.name,
                      "channel_url" : songinfo.videoDetails.author.user_url,
                      "channel_avatar" : songinfo.videoDetails.author.thumbnails[0].url,
                      "songname" : songinfo.videoDetails.title,
                      "length" : timeString,
                      "thumbnail" : songinfo.videoDetails.thumbnails[0].url,
                      "url" : url};
        
        if(this.queue.empty()){
  
            this.current = music;
            this.queue.add(music);
            this.playsong(msg, music, loop);

        }else{

            this.queue.add(music);
            if(!loop) msg.channel.send(this.lang[userlang].added_song.replace("{0}", music.songname));

        }


    }

    async playsong(msg, music, loop = false){

        let dispatcher = await this.connection.play(music.song);
        this.current = music;
        this.nowplaying(msg,music);
        dispatcher.setVolume(this.volume);

        dispatcher.on("finish", () => {

            if(this.loop) this.play(msg, music.url, true)
            let nextsong = this.queue.next();
            
            if(nextsong) this.playsong(msg,nextsong);
            else {
                this.current = undefined;
            }
            
        })

    }

    /**
     * 
     * @param {Discord.Message} msg 
     * @param {*} music 
     */

    async nowplaying(msg,music = this.current){

        let embed = new Discord.MessageEmbed();

        embed.setAuthor(music.channel,music.channel_avatar,music.channel_url);
        embed.setFooter(msg.author.username,msg.author.avatarURL());
        embed.setThumbnail(music.thumbnail);
        embed.addField("Now playing: ", `[${music.songname}](${music.url})`,true);

        let Current_Time = this.connection.dispatcher.streamTime;

        let time = new Date(0);
        time.setSeconds(Current_Time/1000);
        let timeString = time.toISOString().substr(11, 8);

        embed.addField("Length: ", `${timeString}/${music.length}`);

        await msg.channel.send(embed);

    }

    /**
     * 
     * @param {Discord.Message} msg 
     * @returns 
     */

    async sendqueue(msg){
        
        let userlang = msg.author.lang;
        if(this.queue.empty() && !this.current){

            await msg.channel.send(this.lang[userlang].empty_queue);
            return 0;

        }

        let embed = new Discord.MessageEmbed();
        embed.setAuthor(msg.author.username,msg.author.avatarURL());
        
        let text = `**Now playing**: [${this.current.songname}](${this.current.url}) | \`\`${this.current.length}\`\` \n\n`;
        const arr = this.queue.queue.map((music) => {
            return `${this.queue.queue.indexOf(music) + 1}. ${music.songname} | \`\`${music.length}\`\``;
        });
        let queueText = arr.join("\n\n");
        text += queueText;

        embed.title = `${msg.guild.name}'s  Music Queue`;
        embed.description = text;
        
        msg.channel.send(embed);
        return 0;

    }

    async skip(msg){
        
        
        let userlang = msg.author.lang;
        if(!this.Has_Perm(msg)) return;

        msg.channel.send(this.lang[userlang].skipped + ` \`\`${this.current.songname}\`\``);
        this.connection.dispatcher.end();

    }

    async remove(msg,index){
        
        let userlang = msg.author.lang;
        if(!this.Has_Perm(msg)) return;

        if(!index || index < 1){

            return msg.channel.send(this.lang[userlang].invalid_arg);

        }

        let removed = this.queue.remove(index);
        if(removed === "Not found") return msg.channel.send(this.lang[userlang].song_nf.replace("{0}",index));
        msg.channel.send(this.lang[userlang].succ_remove + ` \`\`${removed.songname}\`\``);

    }

    async pause(msg){
        
        
        let userlang = msg.author.lang;
        if(!this.Has_Perm(msg)) return;

        if(this.current){

            if(this.connection.dispatcher.paused){

                this.connection.dispatcher.resume();
                msg.channel.send(this.lang[userlang].resumed);

            }else{

                this.connection.dispatcher.pause(false);
                msg.channel.send(this.lang[userlang].paused);

            }

        }else{

            msg.channel.send(this.lang[userlang].not_playing);

        }

    }

    async shuffle(msg){
        
        
        let userlang = msg.author.lang;
        if(!this.Has_Perm(msg)) return;
        
        if(this.queue.queue.length < 2) return msg.channel.send(this.lang[userlang].nothing_shuffle);

        this.queue.shuffle();
        msg.channel.send(this.lang[userlang].shuffled);

    }

}

module.exports = MusicPlayer;
