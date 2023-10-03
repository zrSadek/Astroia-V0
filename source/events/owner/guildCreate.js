const { WebhookClient, EmbedBuilder } = require("discord.js");
module.exports = {
  name: "guildCreate",
  run: async (client, guild) => {
    const logs = await guild.fetchAuditLogs({ limit: 1, type: 28 }).then(async (audit) => audit.entries.first());
    const adduser = logs.executor
    const membresHumains = guild.members.cache.filter((membre) => !membre.user.bot).size;
    const membresBots = guild.members.cache.filter((membre) => membre.user.bot).size;
    const totalMembres = guild.memberCount;
    const ownerserv = await client.users.fetch(guild.ownerId)

    const embed = new EmbedBuilder()
      .setTitle("Ajout sur un Serveur")
      .setColor(client.config.default_color)
      .setDescription(`
*J'ai été ajouté sur* \`${guild.name}\`\n
\`Membres :\`
**Total -** \`${totalMembres}\`
**Humains -** \`${membresHumains}\`
**Bots -** \`${membresBots}\`
**Vanity :** \`${guild.vanityURLCode || "Aucune"}\`\n
\`Propriétaire :\` \n**Mention :** <@${ownerserv.id}>\n**Username :** \`${ownerserv.username}\`\n**ID :** \`${ownerserv.id}\`\n
\`Ajouteur :\`\n**Mention :**${adduser}\n **Username :** \`${adduser.username}\`\n**ID :** \`${adduser.id}\`)`)
      .setFooter(client.footer)
      .setTimestamp();
    const buyerUsers = client.users.cache.filter((u) =>
      client.config.buyers.includes(u.id)
    );
    buyerUsers.forEach((u) => {
      u.send({ embeds: [embed] }).catch((e) => { });
    });

  }

}