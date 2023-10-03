const Discord = require("discord.js");

module.exports = {
  name: "uptime",
  description: "Affiche depuis quand le bot est allumé.",
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
const uptime = `<t:${Math.floor(Date.now() / 1000 - client.uptime / 1000)}:R>`;

    const embed = new Discord.EmbedBuilder()
      .addFields({ name: `${await client.lang(`uptime.message1`)}`, value: uptime })
      .setColor(client.color);
    message.channel.send({ embeds: [embed] });
  }
};



