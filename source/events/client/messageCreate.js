const { Client, Message } = require('discord.js');

module.exports = {
  name: 'messageCreate',
  run: async (client, message) => {
    if (!message.guild || message.author.bot) return;
    const prefix = client.db.get(`prefix_${message.guild.id}`) || client.config.prefix
    client.color = client.db.get(`color_${message.guild.id}`) || client.config.default_color
    client.prefix = client.db.get(`prefix_${message.guild.id}`) || client.config.prefix
    client.noperm = client.db.get(`noperm_${message.guild.id}`) === 'vent' ? null : (client.db.get(`noperm_${message.guild.id}`) || await client.lang('perm'));

    if (message.content === `<@${client.user.id}>` || message.content === `<@!${client.user.id}>`) {
        return message.channel.send(await client.lang('prefixbot') + ` \`${prefix}\``).catch(() => {});
    }

    if (!message.content.startsWith(prefix) || message.content === prefix || message.content.startsWith(prefix + ' ')) {
      if (!message.content.startsWith(`<@${client.user.id}>`) && !message.content.startsWith(`<@!${client.user.id}>`)) {
        return;
      }
    }
  
    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
    if (!prefixRegex.test(message.content)) return;
    const [, matchedPrefix] = message.content.match(prefixRegex);
    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);    
    const commandName = args.shift()?.toLowerCase().normalize();
    if (!commandName) return;

    const cmd = client.commands.get(commandName) || client.aliases.get(commandName);
    if (!cmd) return;

    cmd.run(client, message, args, commandName);
  }
}
