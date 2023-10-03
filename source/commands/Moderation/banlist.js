const { ButtonBuilder, ActionRowBuilder, EmbedBuilder, ButtonStyle } = require('discord.js');
const Astroia = require('../../structures/client/index');

module.exports = {
  name: 'banlist',
  aliases: ['listban'],

  /**
   * 
   * @param {Astroia} client 
   * @param {Discord.Message} message
   * @param {string[]} args
   * 
   */
  run: async (client, message, args, commandName) => {
    let pass = false

    let staff = client.staff

    if (!staff.includes(message.author.id) && !client.config.buyers.includes(message.author.id) && client.db.get(`owner_${message.author.id}`) !== true) {
        if (client.db.get(`perm_${commandName}.${message.guild.id}`) === "1" && message.member.roles.cache.some(r => client.db.get(`perm1.${message.guild.id}`)?.includes(r.id))) pass = true;
        if (client.db.get(`perm_${commandName}.${message.guild.id}`) === "2" && message.member.roles.cache.some(r => client.db.get(`perm2.${message.guild.id}`)?.includes(r.id))) pass = true;
        if (client.db.get(`perm_${commandName}.${message.guild.id}`) === "3" && message.member.roles.cache.some(r => client.db.get(`perm3.${message.guild.id}`)?.includes(r.id))) pass = true;
        if (client.db.get(`perm_${commandName}.${message.guild.id}`) === "4" && message.member.roles.cache.some(r => client.db.get(`perm4.${message.guild.id}`)?.includes(r.id))) pass = true;
        if (client.db.get(`perm_${commandName}.${message.guild.id}`) === "5" && message.member.roles.cache.some(r => client.db.get(`perm5.${message.guild.id}`)?.includes(r.id))) pass = true;
        if (client.db.get(`perm_${commandName}.${message.guild.id}`) === "public") pass = true;
    } else pass = true;

    if (pass === false) {
if (client.noperm && client.noperm.trim() !== '') {
    return message.channel.send(client.noperm);
} else {
    return; 
}
} 
    const bans = await message.guild.bans.fetch();
    if (!bans.size) return message.channel.send('Aucun membre banni sur ce serveur.');
    
    const PAGE_SIZE = 10;
    const pageCount = Math.ceil(bans.size / PAGE_SIZE);
    let currentPage = 1;

    const banList = bans.map((ban) => `[\`${ban.user.tag}\`](https://discord.com/users/${ban.user.id}) | (\`${ban.user.id}\`)`).slice(0, PAGE_SIZE);
    const banListMessage = await message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor(client.color)
          .setTitle(`Liste des bannissements de ${message.guild.name}`)
          .setDescription(`${banList.join('\n')}`)
          .setFooter({ text: `Page ${currentPage}/${pageCount} - ${bans.size} ban`})
      ]
    });

    if (pageCount > 1) {
      const previousButton = new ButtonBuilder()
        .setCustomId('previous')
        .setLabel('<<<')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(true);

      const nextButton = new ButtonBuilder()
        .setCustomId('next')
        .setLabel('>>>')
        .setStyle(ButtonStyle.Primary)

      const navigationRow = new ActionRowBuilder()
        .addComponents(previousButton, nextButton);

      const collector = banListMessage.createMessageComponentCollector({
        filter: (interaction) => interaction.user.id === message.author.id,
        time: 30000, 
      });

      collector.on('collect', async (interaction) => {
        if (interaction.customId === 'previous' && currentPage > 1) {
          currentPage--;
        } else if (interaction.customId === 'next' && currentPage < pageCount) {
          currentPage++;
        } else {
          return;
        }

        const start = (currentPage - 1) * PAGE_SIZE;
        const end = currentPage * PAGE_SIZE;

        const newBanList = bans.map((ban) => `[\`${ban.user.tag}\`](https://discord.com/users/${ban.user.id}) | (\`${ban.user.id}\`)`).slice(start, end);
        const newBanListMessage = {
          embeds: [
            new EmbedBuilder()
              .setColor(client.color)
              .setTitle(`Liste des bannissements de ${message.guild.name}`)
              .setDescription(`${newBanList.join('\n')}`)
              .setFooter({text: `Page ${currentPage}/${pageCount} - ${bans.size} ban`})
          ],
        };

        interaction.update({
          embeds: [newBanListMessage.embeds[0]],
          components: [
            new ActionRowBuilder()
              .addComponents(
                new ButtonBuilder()
                  .setCustomId('previous')
                  .setLabel('<<<')
                  .setStyle(ButtonStyle.Primary)
                  .setDisabled(currentPage === 1),
                new ButtonBuilder()
                  .setCustomId('next')
                  .setLabel('>>>')
                  .setStyle(ButtonStyle.Primary)
                  .setDisabled(currentPage === pageCount)
              )
          ]
        });
      });

      collector.on('end', () => {
        banListMessage.edit({ components: [] });
      });

      await banListMessage.edit({
        components: [navigationRow],
      });
    }
  }
};
