const Discord = require('discord.js');
const Astroia = require('../../structures/client/index');
const { MessageActionRow, MessageSelectMenu } = require('discord.js');

module.exports = {
    name: "unlockall",
    description: "Permet de dévérouiller tout les channels du serveur ",

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
        try {
            const channels = message.guild.channels.cache;
            channels.forEach(async (channel) => {
                await channel.permissionOverwrites.edit(message.guild.roles.everyone, {
                    SendMessages: true
                }).catch((error) => {
                    console.error(`Impossible de lock: ${channel.name}:`, error);
                });
            });

            message.channel.send(await client.lang(`unlockall.message1`));

            let Embed = new Discord.EmbedBuilder()
                .setColor(client.color)
                .setDescription(`${message.author} ${await client.lang(`unlockall.message2`)}`);
            message.guild.channels.cache.get(client.db.get(`modlogs_${message.guild.id}`))?.send({ embeds: [Embed] });
        } catch (error) {
            console.error(error);
            message.channel.send(await client.lang(`unlockall.message3`));
        }
    }
}






