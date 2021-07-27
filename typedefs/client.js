const Discord = require("discord.js");
const fs = require("fs");
const disbut = require("discord-buttons");
const Command = require("./Command");
const language = require("../language.json");
const Sequelize = require("sequelize");

try{
    
    var {host,username,password,database} = require("../config.json");

}catch (err){



}
/**
 * SomeClass is an example class for my question.
 * @class
 * @constructor
 * @public
 */

class client extends Discord.Client{

    constructor(owner,Dctogether,prefix){

        super();

        this.discordtogether = new Dctogether(this);
        this.owner = owner;
        this.prefix = prefix;
        this.language = language;
        /**
         * @type {Sequelize.Model}
         * @public
         */
        this.userdata = undefined;

        /**
         * @type {Sequelize}
         * @public
         */

        this.Sequelize = undefined;

        this.commands = new Discord.Collection();// commands
        this.groups = new Discord.Collection();//command groups
        this.cooldown = new Discord.Collection();//cooldown
        this.playing = new Discord.Collection();//game
        this.music = new Discord.Collection();//music

        this.invlink = "https://discord.com/api/oauth2/authorize?client_id=735804773864833065&permissions=4025876289&scope=bot";
        this.colors = {
            "red" : 0xF00303,
            "yellow" : 0xFFE100,
            "cyan" : 0x1DC9D6,
            "black" : 0x000000,
            "white" : 0xF0F0F0
        };

        fs.readdir("./cmds", (err, dirs) => {
            
            dirs.forEach( (dir) => {

                console.log(dir);
                this.groups.set(dir,[]);

                fs.readdir(`./cmds/${dir}`, (err, files) => {

                    files.forEach( (file) => {

                        let Commandcls = new require(`../cmds/${dir}/${file}`);
                        let command = new Commandcls(this);

                        file = file.replace(".js","");
                        command.description = this.language.commands_help[file];
                        
                        this.commands.set(command.name,command);
                        this.groups.get(dir).push(command.name);
    
                    })
                })
            })
        })   
    }

    EmbedMaker(msg,description,color,fields){

        let embed = new Discord.MessageEmbed();
        embed.setAuthor(msg.author.username + "#" + msg.author.discriminator, msg.author.avatarURL());
        embed.description = description;
        embed.color = color;
        embed.setFooter(`Bot made by: ${this.owner.name}`,this.owner.avatar);
        if (fields!=undefined) embed.addFields(fields);

        return embed;

    }

    stopgame(collector1, collector2){

        collector1.stop();
        collector2.stop();

    }

    /**
     * @param {Discord.Message} msg
     * @param {Discord.User} iuser 
     * @returns 
     */

    Check_Playing(msg,iuser,lang){

        let bot = this;

        if(bot.playing.has(msg.author.id)){

            if(bot.playing.get(msg.author.id) === "Currently being invited") 
            {
                msg.channel.send(lang.being_invited);
                return 0;
            }

            msg.channel.send(lang.you_playing + ` ${bot.playing.get(msg.author.id)}`);
            return 0;

        }

        if(iuser == undefined) return 1;

        
        if(bot.playing.has(iuser.id)){

            if(bot.playing.get(msg.author.id) === "Currently being invited") 
            {
                msg.channel.send(iuser.username + lang.target_invited);
                return 0;
            }

            msg.channel.send(`${iuser.username}` +  lang.target_playing  + `${bot.playing.get(iuser.id)}`);
            return 0;

        }

        return 1;

    }

    logintodb(){

        this.Sequelize = new Sequelize({

            database: database || process.env.DATABASE,
            username: username || process.env.USERNAME,
            password: password || process.env.PASSWORD,
            host:  process.env.HOST || host,
            port: 5432,
            dialect: "postgres",
            logging: false,
            dialectOptions: {
                ssl: {
                    require: true,
                    rejectUnauthorized: false,
                },
            },
        });

        this.userdata = this.Sequelize.define("userdata",{

            nickname: {
                type: Sequelize.STRING,
                unique: true,
            },

            user_id: {
                type: Sequelize.STRING
            },

            language: {
                type : Sequelize.STRING,
                defaultValue : "zh_TW"
            },

            money: {
                type : Sequelize.INTEGER,
                defaultValue : 0,
                allownull : false
            },

            experience: {
                type : Sequelize.INTEGER,
                defaultValue : 0,
                allownull : false
            },

            level: {
                type: Sequelize.INTEGER,
                defaultValue : 1,
                allownull : false
            },

            loved: {
                type: Sequelize.ARRAY(Sequelize.INTEGER),
                defaultValue : [],
                allownull : false
            },

            osu_name: {
                type: Sequelize.STRING
            }

        });

        this.userdata.sync();

    }
    
    async secondtohhmmss(second){
        
        let time = new Date(0);
        time.setSeconds(parseInt(second));
        return time.toISOString().substr(11, 8);

    }

    async Execute_Command(msg,cmd,args){

        let client = this;
        let lang = 
        {
            "zh_TW" : "請放慢速度",
            "en_US" : "Please slowdown"
        };

        if(cmd !== undefined){

            if(client.cooldown.get(msg.author.id) > 3){
            
                msg.channel.send(lang[msg.author.lang]);
                return 0;
    
            }

            let search_cmd = require("../functions/search_command");
            let command = await search_cmd(msg, client, cmd);
    
            if(command){
    
                if (!client.cooldown.has(msg.author.id)){

                    client.cooldown.set(msg.author.id,1);
                    console.log(client.cooldown.get(msg.author.id));

                }else{

                    client.cooldown.set(msg.author.id,client.cooldown.get(msg.author.id) + 1);
                    console.log(client.cooldown.get(msg.author.id));

                }

                await command.execute(msg,args)
                    .then(() => {
                        setTimeout(() => {
                            client.cooldown.set(msg.author.id,client.cooldown.get(msg.author.id) - 1);
                        } , 7000);
                        console.log("executed");
                    })
                    .catch( (reason) =>{
                        client.channels.cache.get("866296391281803274").send(
                            `\`\`-ERROR-\`\` \nThe command \`\`${cmd}\`\` is executed by user ${msg.author.username}#${msg.author.discriminator}\nError reason:\n\`\`\`js\n${reason}\n\`\`\``);
                    })
                
                
    
                return 0;

            }
    
            return 1;
        }
    
        return 0;

    }

}


module.exports = client;
