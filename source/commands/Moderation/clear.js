const Astroia = require("../../structures/client/index");
const Discord = require('discord.js')

module.exports = {
  name: "clear",
  description: "clear le nombre de messsage entre 1 et 100",
      run: async(client, message, commandName) => {

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
const args = message.content.split(' ').slice(1);
const amount = parseInt(args[0]);

if (isNaN(amount) || amount <= 0 || amount > 100) {
  return message.reply(await client.lang('clear.nombre'));
}

try {
  const fetched = await message.channel.messages.fetch({ limit: amount });
  const messagesToDelete = fetched.filter(msg => Date.now() - msg.createdTimestamp < 1209600000);
  await message.channel.bulkDelete(messagesToDelete, true);

  const deletedCount = messagesToDelete.size;
  const messages = (await client.lang('clear.clear')).replace("{deletedCount}", `\`${deletedCount}\``)
  message.channel.send({content : messages});

} catch (err) {
  console.error('Erreur :', err);
  message.reply(await client.lang('erreur'));
}
}
}