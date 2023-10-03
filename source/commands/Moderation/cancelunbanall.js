module.exports = {
    name: 'cancelunbanall',
    description: 'Annule l\'unbanall de tous les bans.',
    usage: 'cancelunbanall',
    run: async (client, message) => {
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
        const unbanall = client.db.get(`unbanall_${message.guild.id}`);

        if (!unbanall || unbanall.length === 0) {
            return message.reply({ content: "Aucun ban n'a été annulé récemment.", allowedMentions: { repliedUser: false } });
        }

        try {
            unbanall.forEach(async (user) => {
                await message.guild.members.ban(user.id);
            });

            client.db.delete(`unbanall_${message.guild.id}`);

            return message.reply({ content: "L'annulation des bans a été annulée avec succès.", allowedMentions: { repliedUser: false } });
        } catch (error) {
            console.error(error);
            message.reply(await client.lang('erreur'));
        }
    }
};
