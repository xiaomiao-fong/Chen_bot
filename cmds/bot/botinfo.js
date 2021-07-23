const Command = require("../../typedefs/Command");
const Discord = require("discord.js")



class info extends Command{

    constructor(client){

        super("botinfo","bot","Shows the information's of this bot",client)

        /**
         * 
         * @param {Discord.Message} msg 
         * @param {*} args 
         */

        this.cmd = async function(msg, args){

            let embed = new Discord.MessageEmbed()
            embed.setAuthor(this.client.user.username, this.client.user.avatarURL())
            embed.setColor(this.client.colors.red)
            embed.setFooter(`Executed by ${msg.author.username}`, msg.author.avatarURL())

            embed.title = "橙Chen"
            embed.description = "歡迎使用本機器人!\n \
            本喵目前主要提供的功能主要為音樂與小遊戲!\n \
            目前還有一些功能例如avatar 或者是 uinfo 正在進行開發中\n \
            目前我還是一個剛上路的機器人，如果有任何狀況或錯誤都希望能跟我的製作人 tommy2131#3750 講 \
            也歡迎到本喵的測試群提供意見或回報錯誤喔!^w^\n\n \
            對了，如果喜歡我的服務的話也別忘了到這個網址幫我按星星喔(<ゝω・)☆\n\n \
            Github專案 : https://github.com/xiaomiao-fong/Chen_bot\n \
            橙Chen 測試群連結: https://discord.gg/B7jG7HKc3E \n \
            [機器人邀請連結](https://discord.com/api/oauth2/authorize?client_id=735804773864833065&permissions=4025876289&scope=bot)\n\n \
            製作者: tommy2131#3750"

            embed.setImage("https://cdn.discordapp.com/attachments/867975639590916127/867975724395532288/IMG_20210321_065005_778.jpg")

            msg.channel.send(embed)

        }

    }

}

module.exports = info