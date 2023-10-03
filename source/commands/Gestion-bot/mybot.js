const Astroia = require('../../structures/client/index');
const axios = require('axios');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'mybot',
  description: 'Affiche vos bots',

  /**
   * 
   * @param {Astroia} client 
   * @param {Discord.Message} message
   * @param {string[]} args
   */
  run: async (client, message, args) => {
    
    const user_id = message.author.id;

    try {
      const response = await axios.get(`http://localhost:3000/api/bots/${user_id}`);
      const bots = response.data;

      if (Array.isArray(bots) && bots.length > 0) {
        const embed = new EmbedBuilder()
          .setColor(client.color)
          .setFooter(client.footer)
          .setTitle('Vos Bots');
        let description = '';

        const seuilExpiration = 1000;

        for (let index = 0; index < bots.length; index++) {
          const bot = bots[index];
          const botUser = await client.users.fetch(bot.bot_id);
          const timestamp = Math.floor(bot.temps / 1000);
          const timeRemaining = bot.temps - Date.now();
          const isExpired = timeRemaining < seuilExpiration;
          const expirationText = isExpired ? `expiré <t:${timestamp}:R>` : `expire <t:${timestamp}:R>`;
          description += `**${index + 1} -** [\`${botUser ? botUser.tag : 'Bot introuvable'}\`](https://discord.com/api/oauth2/authorize?client_id=${bot.bot_id}&permissions=8&scope=bot%20applications.commands) - ${expirationText}\n`;
        }

        embed.setDescription(description);
        message.reply({ embeds: [embed] });
      } else {
        message.reply("Vous n'avez aucun bot.");
      }
    } catch (erreur) {
      console.error(erreur);
      message.reply("Une erreur s'est produite lors de la récupération des bots.");
    }
  },
};
