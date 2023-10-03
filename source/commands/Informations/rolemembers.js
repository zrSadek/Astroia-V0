const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'rolemembers',
  description: "Affiche la liste des membres avec un rôle donné",
  usage: "rolemembers <nom du rôle/mention ou ID>",
  /**
   * 
   * @param {Astroia} client 
   * @param {Discord.Message} message
   * @param {string[]} args 
   */
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
    const roleName = args.join(' ');
    if (!roleName) {
      return message.channel.send({ content: await client.lang('rolemembers.norole') });
    }

    const role = message.mentions.roles.first() || message.guild.roles.cache.find(r => r.name === roleName) || message.guild.roles.cache.find(r => r.id === roleName);

    if (!role) {
      return message.channel.send({ content: await client.lang('rolemembers.erreurrole')});
    }

    const membersWithRole = role.members.map(m => `[${m.user.tag}](https://discord.com/users/${m.user.id}) | [${m.user.id}]`).join('\n');

    const embed = new EmbedBuilder()
      .setColor(client.color)
      .setFooter(client.footer)
      .setTitle(`${await client.lang('rolemembers.embedtitle')} "${role.name}"`)
      .setDescription(membersWithRole || await client.lang('rolemembers.nomembre'));


    message.channel.send({ embeds: [embed] });
  },
};
