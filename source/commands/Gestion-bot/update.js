const { exec } = require('child_process');
const axios = require('axios')

function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    return `[${hours}:${minutes}:${seconds}]`;
  }

  module.exports = {
    name: 'update',
    description: 'Met a jour le bot perso',
    /**
     * 
     * @param {Astroia} client 
     * @param {Discord.Message} message
     * 
     **/
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
     const response = await axios.post(`http://${client.config.panel}/api/version`, { version: client.version });
 
     if (response.data.message === 'Mise à jour disponible en attente.') {
       message.channel.send(`\`${getCurrentTime()}\` ${await client.lang('update.message1')}`);
       await new Promise((resolve) => setTimeout(resolve, 2000));
       message.channel.send(`\`${getCurrentTime()}\` ${await client.lang('update.message2')}`);
       await new Promise((resolve) => setTimeout(resolve, 3000));
       message.channel.send(`\`${getCurrentTime()}\` ${await client.lang('update.message3')}`);
       await new Promise((resolve) => setTimeout(resolve, 2000));
       message.channel.send(`\`${getCurrentTime()}\` ${await client.lang('update.message4')}`);
       
       exec(`cd /home/bot/${client.user.id} && rm -r source lang && rm version.js index.js package.json package-lock.json && cd /home/Update && cp -r * /home/bot/${client.user.id} && npm i -g && pm2 restart ${client.user.id}`, async (err, stdout, stderr) => {
         if (err) {
           console.error(err);
           message.channel.send(`\`${getCurrentTime()}\` ${await client.lang('update.erreur')}`);
         } else {
           message.channel.send(`\`${getCurrentTime()}\` ${await client.lang('update.message5')}`);
         }
       });
     } else if (response.data.message === 'Aucune mise à jour disponible.') {
       message.channel.send(await client.lang('update.nomaj'));
     }
 
   } catch (error) {
     console.error(error);
     message.channel.send(`\`${getCurrentTime()}\` ${await client.lang('update.erreur')}`);
   }
 }
  }