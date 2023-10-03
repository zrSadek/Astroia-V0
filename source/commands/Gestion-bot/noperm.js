module.exports = {
    name: "noperm",
    description: "Modifie le message de non-autorisation du bot.",
    usage: "noperm <message/reset/vent>",
    run: async (client, message, args, commandName) => {
        let pass = false
let staff = client.staff
if(!staff.includes(message.author.id) && !client.config.buyers.includes(message.author.id) && client.db.get(`owner_${message.author.id}`) !== true){
    if(client.db.get(`perm_${commandName}.${message.guild.id}`) === "1" && message.member.roles.cache.some(r => client.db.get(`perm1.${message.guild.id}`)?.includes(r.id))) pass = true;
    if(client.db.get(`perm_${commandName}.${message.guild.id}`) === "2" && message.member.roles.cache.some(r => client.db.get(`perm2.${message.guild.id}`)?.includes(r.id))) pass = true;
    if(client.db.get(`perm_${commandName}.${message.guild.id}`) === "3" && message.member.roles.cache.some(r => client.db.get(`perm3.${message.guild.id}`)?.includes(r.id))) pass = true;
    if(client.db.get(`perm_${commandName}.${message.guild.id}`) === "4" && message.member.roles.cache.some(r => client.db.get(`perm4.${message.guild.id}`)?.includes(r.id))) pass = true;
    if(client.db.get(`perm_${commandName}.${message.guild.id}`) === "5" && message.member.roles.cache.some(r => client.db.get(`perm5.${message.guild.id}`)?.includes(r.id))) pass = true; 
    if(client.db.get(`perm_${commandName}.${message.guild.id}`) === "public") pass = "oui";   
} else pass = true;
if (pass === false) {
    if (client.noperm && client.noperm.trim() !== '') {
        return message.channel.send(client.noperm);
    } else {
        return; 
    }
}
        let origine = await message.reply(await client.lang('noperm.originale'));
        
        if (!args[0]) {
            return origine.edit(await client.lang('noperm.erreur'));
        }

        if (args[0] === 'reset') {
            await client.db.delete(`noperm_${message.guild.id}`);
            return origine.edit(await client.lang('noperm.reset'));
        }
        
        if (args[0] === 'vent') {
            await client.db.set(`noperm_${message.guild.id}`, 'vent');
            return origine.edit(await client.lang('noperm.vent'));
        }

        const newMessage = args.join(' ');
        await client.db.set(`noperm_${message.guild.id}`, newMessage);
        return origine.edit(`${await client.lang('noperm.set')} \`${newMessage}\``);
    }
};
