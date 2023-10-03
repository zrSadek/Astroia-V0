const Discord = require('discord.js');
const Astroia = require('../../structures/client/index');

module.exports = {
    name: "autoreact",
    aliases: ["auto-react"],
    description: "Permet de configurer le autoreact",
    /**
     * @param {Astroia} client
     */
    usages: "autoreact add <emojis> [#channel/id]",
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

        let add = args[0] === "add";
        let remove = args[0] === "del" || args[0] === "remove";
        let list = args[0] === "list";

        if (add) {
            let emoji = args[1] || client.emojis.cache.first();
            let channel = message.channel || message.mentions.channels.first() || args[2];
            if (!emoji) return;
            client.db.push(`autoreact_${message.guild.id}`, { channel: channel.id, emoji: emoji });
            message.channel.send(`${await client.lang(`autoreact.message1`)} ${emoji}`);
        }

        if (remove) {
            let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]) || message.channel.id;
            let emoji = args[2] || client.emojis.cache.first();
            if (!emoji || !channel) return;
            client.db.set(`autoreact_${message.guild.id}`, client.db.get(`autoreact_${message.guild.id}`).filter(r => r.channel !== channel.id && r.emoji !== emoji));
            message.channel.send(`Le messages dans ${channel} n'auront plus automatiquement comme réaction : ${emoji}`);
        }

        if (list) {
            let autoreact = client.db.get(`autoreact_${message.guild.id}`);
            if (!autoreact || autoreact.length === 0) return message.channel.send(await client.lang('autoreact.message3'));

            if (autoreact.length > 0) {
                const autoreactList = await Promise.all(autoreact.map(async (r, index) => {
                    const channel = await client.channels.fetch(r.channel);
                    const channelName = channel.name;
                    return `**${index + 1} - Autoreact** ${r.emoji}\n \`Channel :\` [\`${channelName}\`](https://discord.com/channels/${message.channel.id}/${r.channel}) (\`${r.channel}\`)\n\`Emoji :\` ${r.emoji}`;
                }));

                let Embed = new Discord.EmbedBuilder()
                    .setColor(client.color) 
                    .setTitle(await client.lang('autoreact.message4'))
                    .setDescription(autoreactList.join('\n'))
                    .setFooter(client.footer);

                message.channel.send({ embeds: [Embed] });
            }
        }
    }
}
