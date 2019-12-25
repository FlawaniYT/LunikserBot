const { Client, RichEmbed, Collection } = require("discord.js");
const { config } = require("dotenv");
const fs = require("fs");
const moment = require('moment')


const client = new Client({
    disableEveryone: true
});

client.commands = new Collection();
client.aliases = new Collection();

client.categories = fs.readdirSync("./commands/");

config({
    path: __dirname + "/.env"
});

["command"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});



client.on("ready", () => {
    console.log(`Jestem Gotowy, nazywam się ${client.user.username}`);

    setInterval(function() {
        let statuses = [
            `Subskrybuj Lunikser`,
            `Miłego dnia!`,
            `Wesołych Świąt 🎅`,
            `Prefix: _`,
            `Dzisiaj jest ${moment(Date.now()).format('DD.MM.YYYYr.')}`, //DD.MM.YYYYr.
        ]
        let status = statuses[Math.floor(Math.random() * statuses.length)];
        client.user.setActivity(status, {
            type: "PLAYING"
        });
    }, 10000)
});





client.on("message", async message => {
    const prefix = "_";

    if (message.author.bot) return;
    if (!message.guild) return;
    if (!message.content.startsWith(prefix)) return;
    if (!message.member) message.member = await message.guild.fetchMember(message);

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    
    if (cmd.length === 0) return;
    
    let command = client.commands.get(cmd);
    if (!command) command = client.commands.get(client.aliases.get(cmd));

    if (command) 
        command.run(client, message, args);
});


client.login(process.env.TOKEN);
