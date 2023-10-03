module.exports = {
  name: "unowner",
  description: "Permet d'enlever un owner",
  usages: "unowner <utilisateur/id>",
  run: async (client, message, args, commandName) => {
    if (!client.config.buyers.includes(message.author.id)) {
      return message.channel.send(await client.lang('owner.perm'));
  }

      let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

      if (member) {
          client.db.delete(`owner_${member.id}`);
          message.channel.send({ content: `\`${member.user.username}\`${await client.lang(`unowner.unowner`)}` });
      } else {
          message.channel.send({ content: await client.lang(`unowner.erreur`) });
      }
  }
};
