const Command = require("../../typedefs/Command");
const Discord = require("discord.js")

class userinfo extends Command{

    constructor(client){

        super("userinfo", "user", client)

        this.aliases = ["ui"];

        /**
         * 
         * @param {Discord.Message} msg 
         * @param {*} args 
         * @returns 
         */

        this.cmd = async function(msg, args){

            if(!msg.guild) return 0;

            let fetch_user = require("../../functions/fetch_user.js");
            let user = await fetch_user(msg, args, this.client);

            if(!user) user = msg.author;

            let embed = new Discord.MessageEmbed();

            embed.title = `${user.username}'s ${this.lang[msg.author.lang].userinfo}`;
            embed.description = `id : ${user.id}`;
            embed.setThumbnail(user.avatarURL());
            embed.setColor(this.client.colors.red)
            embed.setFooter(`Executed by: ${msg.author.username}`, msg.author.avatarURL())

            //online status
            let current_status = {name : this.lang[msg.author.lang].curr_status, value : msg.author.presence.status, inline : true};

            //custom status
            let custom = "❌";
            if(msg.author.presence.activities){

                if(msg.author.presence.activities[0].type == "CUSTOM_STATUS"){

                    let activity = msg.author.presence.activities[0];
                    if(activity.emoji.id === undefined) custom = `${activity.emoji.name} ${activity.state}`;
                    else custom = `<:${activity.emoji.name}:${activity.emoji.id}> ${activity.state}`;

                }

            }

            let custom_status = {name : this.lang[msg.author.lang].custom_status, value : custom, inline : true};

            //highest role

            let role = msg.member.roles.highest;
            let role_field = {name : this.lang[msg.author.lang].high_role, value : role, inline : true};

            //created date

            let created = msg.author.createdAt
            let created_field = {name : this.lang[msg.author.lang].created, value : created.toDateString(), inline : true};

            //joined date
            let joined = msg.member.joinedAt.toDateString()
            let joined_field = {name : this.lang[msg.author.lang].joined, value : joined, inline : true}


            embed.addFields([current_status, custom_status, role_field, created_field, joined_field])
            msg.channel.send(embed);

        };

        this.lang = {

            "zh_TW":
            {
                "userinfo" : "用戶資料",
                "curr_status" : "目前狀態:  ",
                "custom_status" : "自訂狀態:  ",
                "high_role" : "最高身分組:  ",
                "created" : "帳號建立於:  ",
                "joined" : "加入日期:  "
            },
            "en_US":
            {
                "userinfo" : "userinfo",
                "curr_status" : "Current status:  ",
                "custom_status" : "Custom status:  ",
                "high_role" : "Highest role:  ",
                "created" : "Account created at:  ",
                "joined" : "Joined at:  "
            }

        };

    }

}

module.exports = userinfo