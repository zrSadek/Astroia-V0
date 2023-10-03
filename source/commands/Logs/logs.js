const Discord = require('discord.js');

module.exports = {
    name: "logs",
    aliases: ["log"],
    description: "Affiche le status des logs !",
    run: async (client, message, args, commandName) => {

        let pass = false;
        let staff = client.staff;

        if (!staff.includes(message.author.id) && !client.config.buyers.includes(message.author.id) && client.db.get(`owner_${message.author.id}`) !== true) {
            if (client.db.get(`perm_${commandName}.${message.guild.id}`) === "1" && message.member.roles.cache.some(r => client.db.get(`perm1.${message.guild.id}`)?.includes(r.id))) pass = true;
            if (client.db.get(`perm_${commandName}.${message.guild.id}`) === "2" && message.member.roles.cache.some(r => client.db.get(`perm2.${message.guild.id}`)?.includes(r.id))) pass = true;
            if (client.db.get(`perm_${commandName}.${message.guild.id}`) === "3" && message.member.roles.cache.some(r => client.db.get(`perm3.${message.guild.id}`)?.includes(r.id))) pass = true;
            if (client.db.get(`perm_${commandName}.${message.guild.id}`) === "4" && message.member.roles.cache.some(r => client.db.get(`perm4.${message.guild.id}`)?.includes(r.id))) pass = true;
            if (client.db.get(`perm_${commandName}.${message.guild.id}`) === "5" && message.member.roles.cache.some(r => client.db.get(`perm5.${message.guild.id}`)?.includes(r.id))) pass = true;
            if (client.db.get(`perm_${commandName}.${message.guild.id}`) === "public") pass = true;
        } else pass = true;

       if (pass === false) {
    if (client.noperm && client.noperm.trim() !== '') {
        return message.channel.send(client.noperm);
    } else {
        return; 
    }
}

let raid = message.guild.channels.cache.get(client.db.get(`raidlogs_${message.guild.id}`))
if(!raid) raid = `[\`${await client.lang(`logs.message1`)}\`](${client.support})`   

let logmsg = message.guild.channels.cache.get(client.db.get(`msglogs_${message.guild.id}`))
if(!logmsg) logmsg = `[\`${await client.lang(`logs.message1`)}\`](${client.support})`

let logvc = message.guild.channels.cache.get(client.db.get(`voicelogs_${message.guild.id}`))
if(!logvc) logvc = `[\`${await client.lang(`logs.message1`)}\`](${client.support})`

let logmod = message.guild.channels.cache.get(client.db.get(`modlogs_${message.guild.id}`))
if(!logmod) logmod = `[\`${await client.lang(`logs.message1`)}\`](${client.support})`

let logsjoinleave = message.guild.channels.cache.get(client.db.get(`joinsleave_${message.guild.id}`))
if(!logsjoinleave) logsjoinleave = `[\`${await client.lang(`logs.message1`)}\`](${client.support})`
const embed = new Discord.EmbedBuilder()
.setColor(client.color)
.setFooter(client.footer)
.setTitle('**LOGS**')
.setDescription(`
**${await client.lang(`logs.message2`)}** ${raid}
**${await client.lang(`logs.message3`)}** ${logmsg}
**${await client.lang(`logs.message4`)}** ${logvc}
**${await client.lang(`logs.message5`)}** ${logmod}
**${await client.lang(`logs.message6`)}** ${logsjoinleave}
`)

return message.channel.send({embeds: [embed]})
    }
}
