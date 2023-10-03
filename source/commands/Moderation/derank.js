module.exports = {
    name: 'derank',
    description: 'Enlève tous les rôles d\'un utilisateur',
    usages: 'derank <@membre/ID du membre>',
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
      const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
  
      if (!member) {
        return message.channel.send('Membre introuvable.');
      }
  
      if (member.roles.highest.comparePositionTo(message.guild.member.me.roles.highest) >= 0) {
        return message.channel.send('Impossible de derank ce membre car il est au-dessus du bot dans la hiérarchie des rôles.');
      }
  
      member.roles.set([])
        .then(() => {
          message.channel.send(`Tous les rôles ont été retirés à ${member}.`);
        })
        .catch(async (error) => {
          console.error(error);
          message.channel.send(await client.lang('erreur'));
        });
    },
};
