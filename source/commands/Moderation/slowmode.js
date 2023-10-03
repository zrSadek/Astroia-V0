const Discord = require('discord.js');
const ms = require('ms')

module.exports = {
    name: "slowmode",
    description: "Permet de mettre en slowmode un channel",
    usages: "slowmode <temps>",
    run: async (client, message, args, commandName) => {

let pass = false

let staff = client.staff

if(!staff.includes(message.author.id) && !client.config.buyers.includes(message.author.id) && client.db.get(`owner_${message.author.id}`) !== true){
    if(client.db.get(`perm_${commandName}.${message.guild.id}`) === "1" && message.member.roles.cache.some(r => client.db.get(`perm1.${message.guild.id}`)?.includes(r.id))) pass = true;
    if(client.db.get(`perm_${commandName}.${message.guild.id}`) === "2" && message.member.roles.cache.some(r => client.db.get(`perm2.${message.guild.id}`)?.includes(r.id))) pass = true;
    if(client.db.get(`perm_${commandName}.${message.guild.id}`) === "3" && message.member.roles.cache.some(r => client.db.get(`perm3.${message.guild.id}`)?.includes(r.id))) pass = true;
    if(client.db.get(`perm_${commandName}.${message.guild.id}`) === "4" && message.member.roles.cache.some(r => client.db.get(`perm4.${message.guild.id}`)?.includes(r.id))) pass = true;
    if(client.db.get(`perm_${commandName}.${message.guild.id}`) === "5" && message.member.roles.cache.some(r => client.db.get(`perm5.${message.guild.id}`)?.includes(r.id))) pass = true; 
    if(client.db.get(`perm_${commandName}.${message.guild.id}`) === "public") pass = true;   
} else pass = true;

if (pass === false) {
    if (client.noperm && client.noperm.trim() !== '') {
        return message.channel.send(client.noperm);
    } else {
        return; 
    }
}
if (!args[0]) {
    return message.channel.send(await client.lang(`slowmode.message1`));
}

let timeInSeconds = 0;

if (args[0].toLowerCase() === "off") {
    timeInSeconds = 0;
} else {
    const timeRegex = /^(\d+)(s|m|h)$/i;
    const match = args[0].match(timeRegex);

    if (!match) {
        return;
    }

    const amount = parseInt(match[1]);
    const unit = match[2].toLowerCase();

    if (isNaN(amount) || amount <= 0) {
        return;
    }

    switch (unit) {
        case "s":
            timeInSeconds = amount;
            break;
        case "m":
            timeInSeconds = amount * 60;
            break;
        case "h":
            timeInSeconds = amount * 3600;
            break;
        default:
            return message.channel.send(`\`${await client.lang(`slowmode.message7`)}\``);
    }
}

try {
    await message.channel.setRateLimitPerUser(timeInSeconds);
    if (timeInSeconds === 0) {
        message.channel.send(await client.lang(`slowmode.message2`));
    } else {
        message.channel.send(`${await client.lang(`slowmode.message4`)} **${args[0]}**.`);
    }

    let channel = message.channel
    let Embed = new Discord.EmbedBuilder()
    .setColor(client.color)
    .setDescription(`${message.author} ${await client.lang(`slowmode.embed`)} **${args[0]}** ${await client.lang(`slowmode.embed2`)} ${channel}`);
message.guild.channels.cache.get(client.db.get(`modlogs_${message.guild.id}`))?.send({ embeds: [Embed] });
} catch (error) {
    console.error(error);
    message.channel.send(await client.lang(`slowmode.message6`));
}


    }
}