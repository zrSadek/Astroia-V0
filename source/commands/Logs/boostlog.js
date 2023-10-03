const Discord = require('discord.js');
const {bot} = require('../../structures/client'); 
const Astroia = require('../../structures/client');

module.exports = {
    name: "boostlog",
    aliases: ["boostlogs","logsboost","logboost"],
    description: "Permet de gérer les logs des boost(s)",
    category: "logs",
    usage: ["boostlog on [channel]", "boostlog off"],
    /**
     * @param {Astroia} client 
     * @param {Discord.Message} message 
     */

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
        let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]);
        if(!channel) channel = message.channel;

        let logs = client.db.get(`boostlog_${message.guild.id}`)

        if (args[0] === "on") {
        client.db.set(`boostlog_${message.guild.id}`, channel.id)
        message.reply(`${await client.lang(`boostlog.message1`)} ${channel}`)
        }

        if (args[0] === "off") {
            client.db.delete(`boostlog_${message.guild.id}`)
            message.reply(`${await client.lang(`boostlog.message2`)}`)
        }
    }
}