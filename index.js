const Discord = require('discord.js')
const Myclient = require('./typedefs/client')
const Dt = require('discord-together')
const {token, prefix, owner} = require('./config.json')
const fs = require('fs')
const Event = require('./typedefs/Event')

const client = new Myclient(owner,Dt.DiscordTogether,prefix)

fs.readdir("./events", (err,files) =>{

    files.forEach(file => {

        let eventcls = require(`./events/${file}`)
        /** @type {Event} event */
        let event = new eventcls(client)

        if(!event.once){

            client.on(event.name, (...args) => event.func(...args));

        }else{

            client.once(event.name, (...args) => event.func(...args));

        }

    })

})


client.login(token)











