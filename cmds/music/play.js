const Command = require("../../typedefs/Command");
const Discord = require("discord.js");
const ytdl = require("ytdl-core");
const ytsr = require("ytsr");
const {MessageMenu,MessageMenuOption,MenuCollector} = require("discord-buttons");


class play extends Command{

    constructor(client){

        super("play","music",client);

        /**
         * 
         * @param {Discord.Message} msg 
         * @param {any[]} args 
         */
        
        this.aliases = ["p"]

        this.cmd = async function(msg,args){

            let status = 1;

            let userlang = msg.author.lang;

            if(!this.client.music.has(msg.guild.id)){

                let joincls = require("./join");
                let joincmd = new joincls(this.client);

                await joincmd.execute(msg,args);

            }

            if(this.client.music.has(msg.guild.id)){

                let search = args.join(' ');

                if(!search){

                    msg.channel.send(this.client.language.commands.music[userlang].missing_arg);
                    return 0;
        
                }

                if(!this.client.music.get(msg.guild.id).has_perm(msg)) return 0 ;
        
                let url;
                
                if(!ytdl.validateURL(search)){
        
                    msg.channel.send(`Searching \`\`${search}\`\``);
                    let searchresult = await ytsr(search);

                    let options = [];
                    let urls = [];

                    for(let i = 0; i < 10; i++){

                        let info = searchresult.items[i];
                        let option = new MessageMenuOption();

                        if(info.author === undefined) break; 

                        let authorname = info.author.name;
                        if(authorname.length > 25) authorname = authorname.substr(0,21) + "...";

                        let songname = info.title + ' | ' + info.duration;
                        if(songname.length > 49) songname = info.title.substr(0,35) + "..." + ' | ' + info.duration;

                        option.setLabel(authorname)
                              .setDescription(songname)
                              .setValue(i)

                        options.push(option);

                        urls.push(info.url);

                    }

                    let menu = new MessageMenu();

                    menu.setPlaceholder("Choose a song")
                        .setID("324")
                        .addOptions(options)

                    msg.channel.send("Choose a song!", menu).then( sent => {

                        /** @type {MenuCollector} */
                        let collector = sent.createMenuCollector(b => b.clicker.id === msg.author.id , {time : 15000});
                        
                        collector.once('collect', async menu => {

                            await menu.reply.defer();
                            this.client.music.get(msg.guild.id).play(msg, urls[menu.values[0]]);
                            await menu.reply.delete();

                        })

                        collector.once("end", async (menu, reason) => {

                            if(reason === 'time') { 
                                sent.delete();
                                msg.channel.send("Timeout");
                            }

                        })

                    })

                    let first = searchresult.items[0];
        
                    url = first.url;
        
                }else{
        
                    url = search;
                    this.client.music.get(msg.guild.id).play(msg, url);

        
                }

            }

        };

    }

}

module.exports = play;