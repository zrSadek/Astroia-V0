const axios = require('axios');

module.exports = {
  name: 'version',
  description: 'Permet de savoir si votre bot est à jour ou non',
  run: async (client, message, commandName) => {
    
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
    try {
      const currentVersion = client.version;
      const response = await axios.post(`http://${client.config.panel}/api/version`, { version: currentVersion });

      if (response.data.message === await client.lang(`version.message1`)) {
        const updatebot = (await client.lang('version.maj')).replace("{prefix}", `${client.prefix}`);
        message.channel.send({ content: updatebot });
      } else if (response.data.message === await client.lang(`version.message2`)) {
        message.channel.send({ content: await client.lang('version.nomaj') + ' ' + await client.lang(`checkversion.message1`) + `\`${client.version}\`` });
      }
    } catch (error) {
      console.error(error);
      message.channel.send(await client.lang(`version.message3`));
    }
  },
};
