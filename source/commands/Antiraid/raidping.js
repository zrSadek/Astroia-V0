const Discord = require('discord.js');
const fs = require('fs');
const Astroia = require('../../structures/client');

module.exports = {
    name: "pingraid",
    aliases: ["raidping"],
    description: "Permet de paraméter le pingraid",
    usages: ["pingraid <@role/id>", "pingraid <everyone/here/buyer"],

    /**
     * @param {Astroia} client 
     * @param {Discord.Message} message 
     */

    run: async (client, message, args, commandName) => {

        let pass = false

        let staff = client.staff

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
        if (args[0] === "off") {
            if (!client.db.get(`pingraid_${message.guild.id}`)) return message.channel.send(await client.lang(`raidping.message2`))
            client.db.delete(`pingraid_${message.guild.id}`);
            message.channel.send(await client.lang(`raidping.message1`))
        } else if (args[0] === "everyone" || args[0] === "here" || args[0] === "buyers" || args[0] === "owners") {
            if (client.db.get(`pingraid_${message.guild.id}`) === args[0]) return message.channel.send(`Le pingraid est déjà sur \`${args[0]}\`.`)
            client.db.set(`pingraid_${message.guild.id}`, args[0]);
            message.channel.send(`${await client.lang(`raidping.message3`)} \`${args[0]}\`.`)
        } else if (args[0] === "role") {
            let role = message.mentions.roles.first() || message.guild.roles.cache.find(r => r.name === args[1]) || message.guild.roles.cache.find(r => r.id === args[1]);
            if (!role) return message.channel.send(await client.lang(`raidping.message5`))
            if (client.db.get(`pingraid_${message.guild.id}`) === "role") return message.channel.send(await client.lang(`raidping.message7`))
            client.db.set(`pingraid_${message.guild.id}`, "role");
            client.db.set(`pingraid_role_${message.guild.id}`, role.id);
            message.channel.send(`${await client.lang(`raidping.message6`)} \`${role.name}\`.`)
        }



    }
}