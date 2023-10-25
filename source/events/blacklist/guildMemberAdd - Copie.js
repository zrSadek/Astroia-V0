module.exports = {
  name: "guildMemberAdd",
  run: async (client, member) => {
    if (client.db.get(`blacklist_${member.id}`)) {
      try {
        await member.send({
          content: `Vous êtes blacklist de **${member.guild.name}** vous ne pouvez pas rejoindre le serveur`,
        });
        await member.guild.members.ban(member, {
          reason: `blacklisted`,
        });
      } catch (erreur) {
        console.log(erreur);
      }
    }
  },
};
