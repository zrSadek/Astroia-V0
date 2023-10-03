const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "guildDelete",
    run: async (client, guild) => {
        const membresHumains = guild.members.cache.filter((membre) => !membre.user.bot).size;
        const membresBots = guild.members.cache.filter((membre) => membre.user.bot).size;
        const totalMembres = guild.memberCount;
        const ownerserv = await client.users.fetch(guild.ownerId)
        const embed = new EmbedBuilder()
            .setTitle("Retrait d'un Serveur")
            .setColor(client.config.default_color)
            .setDescription(`
**J'ai été retiré du serveur** \`${guild.name}\`\n
\`Membres :\`
**Total -** \`${totalMembres}\`
**Humains -** \`${membresHumains}\`
**Bots -** \`${membresBots}\`\n
\`Propriétaire :\`
**Mention :** <@${ownerserv.id}>
**Username :** \`${ownerserv.username}\`
**ID :** \`${ownerserv.id}\`
`)
            .setFooter(client.footer)
            .setTimestamp();
        const buyerUsers = client.users.cache.filter((u) =>
            client.config.buyers.includes(u.id)
        );
        buyerUsers.forEach((u) => {
            u.send({ embeds: [embed] }).catch((e) => { });
        });
    }
};
