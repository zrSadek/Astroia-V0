const Discord = require('discord.js');
const {bot} = require('../../structures/client'); 
const fs = require('fs');
const Astroia = require('../../structures/client');

module.exports = {
    name: "antibot",
    description: "Permet de paraméter l'antibot",
    category: "antiraid",
    usage: ["antibot <on/off/max>"],
    

    /**
     * @param {Astroia} client 
     * @param {Discord.Message} message 
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
    const antibotData = await client.db.get(`antibot_${message.guild.id}`) || {status : 'off'}

    if (args[0] === "on") {
        antibotData.status = "on";
        client.db.set(`antibot_${message.guild.id}`, antibotData);
        message.channel.send(await client.lang(`antibot.message2`))
    }

    if (args[0] === "off") {
        antibotData.status = "off";
        client.db.set(`antibot_${message.guild.id}`, antibotData);
        message.channel.send(await client.lang(`antibot.message4`))
    }

    if (args[0] === "max") {
        antibotData.status = "max";
        client.db.set(`antibot_${message.guild.id}`, antibotData);
        message.channel.send(await client.lang(`antibot.message6`))
    }

}
}