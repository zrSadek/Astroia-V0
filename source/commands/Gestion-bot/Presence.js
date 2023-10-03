const Astroia = require('../../structures/client/index');
const db = require('quick.db');
const Discord = require('discord.js');

module.exports = {
    name: 'presence',
    usage: 'presence <status>',
    description: 'Changer la présence du bot (online, idle, dnd)',
    usages: "presence <online/idle/dnd/invisible>",
    /**
     * 
     * @param {Astroia} client 
     * @param {Astroia} message 
     * @param {Astroia} args 
     * @param {Astroia} commandName 
     * @returns 
     */
    run: async (client, message, args, commandName) => {
            
    let staff = client.staff
    let pass = false
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
        const validStatus = ['online', 'idle', 'dnd', 'invisible'];
        const status = args[0]?.toLowerCase();

        if (!status || !validStatus.includes(status)) {
            return message.channel.send(`${await client.lang('presence.erreur')} ${validStatus.map(s => `\`${s}\``).join(', ')}`);
        }
        client.user.setStatus(status)
        await client.db.set('presence', status);
        await message.channel.send(`${await client.lang('presence.set')} \`${status}\`.`);
    }
};
