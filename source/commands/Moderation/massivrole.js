const Discord = require("discord.js");
const Astroia = require("../../structures/client");

module.exports = {
  name: "massiverole",
  aliases: ["massrole"],
  description: "Permet d'ajouter un rôle à tous les membres du serveur",
  category: "moderation",
  usage: ["massiverole <add/remove> <role>"],

  /**
   * @param {Astroia} client
   * @param {Discord.Message} message
   */

  run: async (client, message, args, commandName) => {
    let pass = false;

    let staff = client.staff;

    if (
      !staff.includes(message.author.id) &&
      !client.config.buyers.includes(message.author.id) &&
      client.db.get(`owner_${message.author.id}`) !== true
    ) {
      if (
        client.db.get(`perm_${commandName}.${message.guild.id}`) === "1" &&
        message.member.roles.cache.some((r) =>
          client.db.get(`perm1.${message.guild.id}`)?.includes(r.id)
        )
      )
        pass = true;
      if (
        client.db.get(`perm_${commandName}.${message.guild.id}`) === "2" &&
        message.member.roles.cache.some((r) =>
          client.db.get(`perm2.${message.guild.id}`)?.includes(r.id)
        )
      )
        pass = true;
      if (
        client.db.get(`perm_${commandName}.${message.guild.id}`) === "3" &&
        message.member.roles.cache.some((r) =>
          client.db.get(`perm3.${message.guild.id}`)?.includes(r.id)
        )
      )
        pass = true;
      if (
        client.db.get(`perm_${commandName}.${message.guild.id}`) === "4" &&
        message.member.roles.cache.some((r) =>
          client.db.get(`perm4.${message.guild.id}`)?.includes(r.id)
        )
      )
        pass = true;
      if (
        client.db.get(`perm_${commandName}.${message.guild.id}`) === "5" &&
        message.member.roles.cache.some((r) =>
          client.db.get(`perm5.${message.guild.id}`)?.includes(r.id)
        )
      )
        pass = true;
      if (client.db.get(`perm_${commandName}.${message.guild.id}`) === "public")
        pass = true;
    } else pass = true;

    if (pass === false) return message.channel.send(await client.lang(`perm`));

    let role =
      message.guild.roles.cache.get(args[1]) ||
      message.mentions.roles.first() ||
      message.guild.roles.cache.find((r) => r.name === args[1]) ||
      message.guild.roles.cache.find(
        (r) => r.name.toLowerCase() === args[0].toLowerCase()
      );
    if (!role) return message.reply(``);

    let users = message.guild.members.cache.filter(
      (m) => !m.roles.cache.has(role.id)
    );

    if ( args[0] === "add" ) {
      users.forEach(async (user) => {
        try {
          await user.roles.remove(role);
        } catch (error) {
          console.error(`Error removing role from user ${user.user.tag}:`, error);
        }
      });

      message.channel.send(
        `${await client.lang(`massrole.message1`)} \`${role.name}\` ${await client.lang(`massrole.message2`)} ${message.guild.memberCount} ${await client.lang(`massrole.message3`)}.`
      );

      let Embed = new Discord.EmbedBuilder()
        .setColor(client.color)
        .setAuthor({
          name: `${message.author.tag}`,
          iconURL: message.author.displayAvatarURL(),
        })
        .setDescription(
          `${message.author} ${await client.lang(`massrole.message4`)} \`${role.name}\`.`
        )
        .setFooter(client.footer);
      message.guild.channels.cache
        .get(client.db.get(`modlogs_${message.guild.id}`))
        ?.send({ embeds: [Embed] });
    }

    if ( args[0] === "remove" ) {
      users.forEach(async (user) => {
        await user.roles.remove(role);
      });

      message.channel.send(
        `${await client.lang(`massrole.message1`)} \`${role.name}\` ${await client.lang(`massrole.message5`)} ${message.guild.memberCount} ${await client.lang(`massrole.message3`)}.`
      );

      let Embed = new Discord.EmbedBuilder()
        .setColor(client.color)
        .setAuthor({
          name: `${message.author.tag}`,
          iconURL: message.author.displayAvatarURL(),
        })
        .setDescription(
          `${message.author} ${await client.lang(`massrole.message6`)} \`${role.name}\`.`
        )
        .setFooter(client.footer);
      message.guild.channels.cache
        .get(client.db.get(`modlogs_${message.guild.id}`))
        ?.send({ embeds: [Embed] });
    }
  },
};
