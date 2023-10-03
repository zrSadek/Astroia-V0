
module.exports = {
    name: 'prefix',
    description: 'Change le prefix du bot sur le serveur.',
    usage: 'prefix <prefix>',
        run: async(client, message, args, commandName) => {

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
      const newPrefix = args[0];
  
      if (!newPrefix) {
        return message.channel.send(await client.lang('prefix.erreur'));
      }
        client.db.set(`prefix_${message.guild.id}`, newPrefix)
  
      return message.channel.send(`${await client.lang('prefix.set')} \`${newPrefix}\``);
    },
  };