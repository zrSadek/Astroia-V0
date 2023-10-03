const Discord = require('discord.js');
const Astroia = require('../../structures/client/index');

module.exports = {
    name: "boosters",
    aliases: ["booster"],
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
        
        const guild = message.guild;
        let desc = "";
        guild.members.cache
        .filter((m) => m.premiumSince)
        .forEach((m) => {
            desc += `[${m.user.tag}](https://discord.com/users/${m.user.id}) | \`${m.user.id}\` | <t:${Math.floor(m.premiumSince.getTime() / 1000)}:R>\n`
        })

        let boostE = new Discord.EmbedBuilder()
        .setDescription(desc || await client.lang('booster.nobooster'))
        .setColor(client.color)
        .setFooter(client.footer)
        message.channel.send({ embeds: [boostE], allowedMentions: { repliedUser: false } });
    }
}
