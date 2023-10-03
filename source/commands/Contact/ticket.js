const ms = require('ms');
const Discord = require('discord.js')
const { StringSelectMenuBuilder, ActionRowBuilder, EmbedBuilder, ChannelSelectMenuComponent } = require('discord.js');

module.exports = {
    name: 'modmail',
    description: 'Permet de configurer les modmails',
    run: async (client, message, args, commandName) => {
        let pass = false;
        let staff = client.staff;
        if (!staff.includes(message.author.id) && !client.config.buyers.includes(message.author.id) && client.db.get(`owner_${message.author.id}`) !== true) {
            if (client.db.get(`perm_${commandName}.${message.guild.id}`) === "1" && message.member.roles.cache.some(r => client.db.get(`perm1.${message.guild.id}`)?.includes(r.id))) pass = true;
            if (client.db.get(`perm_${commandName}.${message.guild.id}`) === "2" && message.member.roles.cache.some(r => client.db.get(`perm2.${message.guild.id}`)?.includes(r.id))) pass = true;
            if (client.db.get(`perm_${commandName}.${message.guild.id}`) === "3" && message.member.roles.cache.some(r => client.db.get(`perm3.${message.guild.id}`)?.includes(r.id))) pass = true;
            if (client.db.get(`perm_${commandName}.${message.guild.id}`) === "4" && message.member.roles.cache.some(r => client.db.get(`perm4.${message.guild.id}`)?.includes(r.id))) pass = true;
            if (client.db.get(`perm_${commandName}.${message.guild.id}`) === "5" && message.member.roles.cache.some(r => client.db.get(`perm5.${message.guild.id}`)?.includes(r.id))) pass = true;
            if (client.db.get(`perm_${commandName}.${message.guild.id}`) === "public") pass = true;
        } else {
            pass = true;
        }

        if (pass === false) {
            if (client.noperm && client.noperm.trim() !== '') {
                return message.channel.send(client.noperm);
            } else {
                return;
            }
        }

    const originalmsg = await message.channel.send('Chargement en cours...');

        async function updateEmbed() {
           const db = await client.db.get(`ticket_${message.guild.id}`) || {}

            originalmsg.edit({ content: null, components: [roworig], embeds: [embed] });
        }
        await updateEmbed();

        const collector = message.channel.createMessageComponentCollector({ filter: m => m.user.id == message.author.id, componentType: Discord.ComponentType.StringSelect, time: ms("2m") })

        collector.on("collect", async (i) => {
            
        
        })

       
        collector.on('end', () => {
            originalmsg.edit({ components: []});
        });    
    }
}
