const Discord = require("discord.js");
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require("discord.js");
const Astroia = require("../../structures/client/index");
module.exports = {
  name: "ready",
  /**
   *
   * @param {Astroia} client
   */
  run: async (client) => {
    const embed = new EmbedBuilder()
      .setDescription(
        `*Le bot a démarré* <t:${Math.floor(
          Date.now() / 1000
        )}:R>.\n\n**Développeurs :**\n [\`${
          (await client.users.fetch("648236998657835047")).username
        }\`](${client.support}) \`&\` [\`${
          (await client.users.fetch("1095592017121251400")).username
        }\`](${
          client.support
        })\n\n**Besoin d'aide ? Rejoins notre support :** [\`[Clique ici]\`](${
          client.support
        })`
      )
      .setFooter(client.footer)
      .setColor(client.config.default_color)
      .setTimestamp();
    /*const buyerUsers = client.users.cache.filter((u) =>
      client.config.buyers.includes(u.id)
    );
    buyerUsers.forEach((u) => {
      u.send({ embeds: [embed] }).catch((e) => {});
    });*/
  },
};
