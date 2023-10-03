const Discord = require('discord.js');
const Astroia = require('../../structures/client');

module.exports = {
    name: "unwl",
    aliases: ["unwhitelist"],
    description: "Permet d'enlever un utilisateur de la whitelist",
    usage: ["unwl <utilisateur>"],
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

        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!member || !message.guild.members.cache.has(member.id)) {
            return message.channel.send(await client.lang('tempmute.invalidemembre'));
        }      

        client.db.delete(`wlmd_${message.guild.id}_${member.id}`)
        client.db.set(`wl.${message.guild.id}`, client.db.get(`wl.${message.guild.id}`)?.filter(m => m !== member.id) || [])
        message.channel.send(`${member.user.username} ${await client.lang(`wl.message5`)}`)
    

    }
}