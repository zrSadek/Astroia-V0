const Discord = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require("discord.js")
const Astroia = require('../../structures/client/index');

module.exports = {
    name: 'servers',
    aliases: ['server', 'serveur'],
    description: 'Affiche la liste des serveurs sur lesquels le bot est présent',
    /**
     * 
     * @param {Astroia} client 
     * @param {Discord.Message} message
     * 
     **/
    run: async (client, message, commandName) => {


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
const guilds = client.guilds.cache;
let count = 0 
const guildInvites = guilds.map((guild) => {
    count++
    return `\`\`\`yaml\n[ ${count} ] ${guild.name} - ${guild.id}\`\`\``;
});


const embed = new EmbedBuilder()
    .setColor(client.color)
    .setTitle(await client.lang('servers.server'))
    .setDescription(guildInvites.join('\n'))
    .setFooter(client.footer);

await message.channel.send({ embeds: [embed] });
},
};



