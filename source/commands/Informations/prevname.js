const axios = require('axios');
const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, TextInputBuilder, TextInputStyle, PermissionsBitField, ButtonBuilder, ComponentType, Client, Message, ChannelSelectMenuBuilder, StringSelectMenuOptionBuilder, ButtonStyle, ModalBuilder, messageLink, Collection } = require("discord.js");
const ms = require('ms');

module.exports = {
  name: 'prevname',
  description: 'Affiche vos anciens pseudos',
  usages: "prevname <utilisateur/id>",

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

    const original = await message.channel.send({ content: await client.lang('prevname.recherche') });
    let target;
    if (message.mentions.members.first()) {
        target = message.mentions.members.first();
    } else if (args[0]) {
        try {
            target = await client.users.fetch(args[0])
        } catch (error) {
            return original.edit(await client.lang('prevname.nouser'));
        }
    } else {
        target = message.member;
    }
    
    const userid = target.id;
    
    try {
      const response = await axios.get(`http://${client.config.panel}/prevnames/${userid}`);
      const pseudonyms = response.data.pseudonyms;
      const pseudonymCount = pseudonyms.length;

      if (pseudonymCount === 0) {
        original.edit(await client.lang('prevname.nopseudo'));
      } else {
        const embed = new EmbedBuilder()
          .setColor(client.color)
          .setTitle(await client.lang('prevname.title'))
          .setDescription(pseudonyms.map((entry, index) => `**${index + 1} -** <t:${Math.floor(entry.timestamp)}:D> - [\`${entry.old_name}\`](https://discord.com/users/${userid})`).join('\n'))
          .setFooter({ text: `${await client.lang('prevname.footer')} ${pseudonymCount}`, iconURL: message.author.avatarURL() });
      
        const row = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId(`prevname_button_${message.id}`)
              .setEmoji('🗑️')
              .setStyle(ButtonStyle.Secondary)
          );

        const reply = await original.edit({ embeds: [embed], components: [row],content: null, ephemeral: true });

        let collectprevname = reply.createMessageComponentCollector({ filter: m => m.user.id === target.user.id, componentType: ComponentType.Button, time: ms("2m") });

        client.on('interactionCreate', async (i) => {
          if (i.customId === `prevname_button_${message.id}`) {
          if(i.user.id !== target.user.id) {
            i.reply({ content: await client.lang('noperminterac'), ephemeral: true })
            return;
          }
          }
        })
        collectprevname.on("collect", async (i) => {
          if (i.customId === `prevname_button_${message.id}`) {
            i.reply({ content: await client.lang('prevname.buttonreply'), ephemeral: true }).catch((error) => { console.log(error) });
            reply.delete().catch((error) => { console.log(error) });
          }
        });
      }
    } catch (error) {
      console.error('Erreur lors de la récupération :', error);
      original.edit(await client.lang('erreur'));
    }
  }
};