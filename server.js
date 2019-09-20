require(`dotenv`).config();

//Calling packages
const Discord = require(`discord.js`);
const express = require(`express`);
const fs = require(`fs`);

const client = new Discord.Client({
    disableEveryone: true,
});
//const commands = JSON.parse(fs.readFileSync(`Storage/commands.json`, `utf8`));
const userCooldown = {};

client.userCooldown = userCooldown;
client.fs = fs;

fs.readdir(`./events/`, (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        const event = require(`./events/${file}`);
        let eventName = file.split(`.`)[0];
        console.log(`Attempting to load event ${eventName}`);
        client.on(eventName, event.bind(null, client));
    });
});

client.commands = new Discord.Collection();
fs.readdir(`./commands/`, (err, files) => {
    if (err) console.error(err);

    let jsfiles = files.filter(f => f.split(`.`).pop() === `js`);
    if (jsfiles.length <= 0) {
        console.log(`No loadable commands!`);
        return;
    }
    jsfiles.forEach((f, i) => {
        let props = require(`./commands/${f}`);
        let commandName = f.split(`.`)[0];
        console.log(`Attempting to load command ${commandName}`);
        client.commands.set(props.help.name, props);
    });
});

//Discord Login
client.login(process.env.TOKEN);