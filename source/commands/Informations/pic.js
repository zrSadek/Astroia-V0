const Discord = require('discord.js');
const Astroia = require('../../structures/client/index');

module.exports = {
  name: 'pic',
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
        
    let targetUser;
    if (message.mentions.users.size > 0) {
      targetUser = message.mentions.users.first();
    } else if (args.length > 0) {
      const userID = args[0].replace(/[^0-9]/g, ''); 
      targetUser = await message.client.users.fetch(userID).catch(() => null);
    }

    if (!targetUser) {
      return message.channel.send('Donne un user valide ou un id valide ...');
    }

    const avatarURL = targetUser.displayAvatarURL({ format: 'png', dynamic: true, size: 4096 });
    const embed = new Discord.EmbedBuilder()
      .setColor(client.color)
      .setFooter(client.footer)
      .setDescription(`[\`${targetUser.tag}\`](https://discord.com/users/${targetUser.id}) | \`${targetUser.id}\``)
      .setImage(avatarURL)
    message.channel.send({embeds: [embed]});
  },
};
