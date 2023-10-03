const Discord = require('discord.js');
const Astroia = require('../../structures/client');

module.exports = {
    name: "msglogs",
    aliases: ["messagelogs", "msglog", "logmessage"],
    description: "Permet de gérer les logs de messages",
    /**
     * @param {Astroia} client 
     */
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

        let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]);
        if(!channel) channel = message.channel;

        let logs = client.db.get(`msglogs_${message.guild.id}`)

        if (args[0] === "on") {
            client.db.set(`msglogs_${message.guild.id}`, channel.id)
            message.channel.send(`${await client.lang(`msglog.message1`)} ${channel}`)
        }

        if (args[0] === "off") {
            client.db.delete(`msglogs_${message.guild.id}`)
            message.channel.send(`${await client.lang(`msglog.message2`)}`)
        }

        if (args[0] === "allow") {
            client.db.set(`msglogs_allow_${channel.id}`, true)
            message.channel.send(`${await client.lang(`msglog.message3`)} ${channel} ${await client.lang(`msglog.message4`)}`)
        }

        if (args[0] === "deny") {
            if (!client.db.get(`msglogs_allow_${channel.id}`)) return message.reply(`${await client.lang(`msglog.message3`)} ${channel} ${await client.lang(`msglog.message5`)}`)
            client.db.delete(`msglogs_allow_${channel.id}`)
            message.channel.send(`${await client.lang(`msglog.message3`)} ${channel} ${await client.lang(`msglog.message6`)}`)
        }

    }
}