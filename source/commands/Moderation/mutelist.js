const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'listmute',
  aliases: ["mutelist"],
  description: 'Liste tous les membres mute sur le serveur.',
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

    const mutedMembers = message.guild.members.cache.filter((member) => member.communicationDisabledUntilTimestamp !== null);
    
    if (!mutedMembers.size) return message.reply('Aucun membre mute trouvé sur ce serveur.');

    const PAGE_SIZE = 10;
    const pageCount = Math.ceil(mutedMembers.size / PAGE_SIZE);
    let currentPage = 1;
    const msg = await message.reply(`Recherche en cours...`);

    const sendMuteList = async () => {
      const start = (currentPage - 1) * PAGE_SIZE;
      const end = start + PAGE_SIZE;
      const muteList = mutedMembers
        .map((member) => `[\`${member.user.tag}\`](https://discord.com/users/${member.user.id}) (\`${member.user.id}\`) | [\`Fin :\`](${client.support}) <t:${Math.round(parseInt(member.communicationDisabledUntilTimestamp) / 1000)}:R>`)
        .slice(start, end)
        .join('\n');

      const embed = new EmbedBuilder()
        .setTitle(`List des mute de ${message.guild.name}`)
        .setDescription(muteList)
        .setColor(client.color)
        .setFooter({ text: `Page ${currentPage}/${pageCount}` });

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`avant_${message.id}`)
          .setLabel('<<<')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(currentPage === 1),
        new ButtonBuilder()
          .setCustomId(`suivant_${message.id}`)
          .setLabel('>>>')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(currentPage === pageCount)
      );

      await msg.edit({
        embeds: [embed],
        content: null,
        components: [row],
      });
    };

    await sendMuteList();

    const collector = msg.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 60000,
    });

    collector.on('collect', async (button) => {
        if (button.user.id !== message.author.id) {
          return button.reply({ content: await client.lang('noperminterac'), ephemeral: true });
        }
        if (button.customId === `avant_${message.id}` && currentPage > 1) {
          currentPage--;
          button.deferUpdate()          
        } else if (button.customId === `suivant_${message.id}` && currentPage < pageCount) {
          currentPage++;
          button.deferUpdate()          
        }
  
  
        await sendMuteList();
      });

    collector.on('end', () => {
      msg.edit({ components: [] });
    });
  },
};
