const Discord = require('discord.js');
const Myclient = require('./typedefs/client');
const Dt = require('discord-together');
const token = process.env.TOKEN || require("./config.json").token;
const prefix = process.env.PREFIX || require("./config.json").prefix;
const owner = require("./config_example.json").owner;
const Sequelize = require("sequelize");
const fs = require('fs');
const Event = require('./typedefs/Event');

const client = new Myclient(owner,Dt.DiscordTogether,prefix);


const disbut = require("discord-buttons")(client);

fs.readdir("./events", (err,files) =>{

    files.forEach(file => {

        let eventcls = require(`./events/${file}`);
        /** @type {Event} event */
        let event = new eventcls(client);

        if(!event.once){

            client.on(event.name, (...args) => event.func(...args));

        }else{

            client.once(event.name, (...args) => event.func(...args));

        }

    })

})

client.logintodb();

client.login(token);











