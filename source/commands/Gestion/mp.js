const Discord = require('discord.js');

module.exports = {
    name: 'mp',
    description: 'Envoie un message privé à une personne spécifiée.',
    usage: 'mp @lapersonne <message / embed <id de l\'embed>>',
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
        if (args.length < 2) {
            const response = (await client.lang('mp.erreuruse')).replace("{prefix}", `\`${client.prefix}\``)
             message.channel.send({content: response}).catch(() => {});
            return;
        }

        const mentionedUser = message.mentions.users.first();

        if (!mentionedUser) {
            message.channel.send(await client.lang('mp.nouser'));
            return;
        }

        args.shift();
        const firstArg = args.shift().toLowerCase();
        let messageContent = args.join(' ');

        try {
            if (firstArg === 'embed') {
                const embedMessage = await message.channel.messages.fetch(messageContent);

                if (!embedMessage || !embedMessage.embeds.length) {
                    message.channel.send(await client.lang('mp.embedinvalide'));
                    return;
                }

                const oldEmbed = embedMessage.embeds[0];

                const newEmbed = new Discord.EmbedBuilder()
                    .setColor(oldEmbed.color)
                    .setTitle(oldEmbed.title)
                    .setDescription(oldEmbed.description)
                    .setURL(oldEmbed.url)
                    .setImage(oldEmbed.image?.url)
                    .setThumbnail(oldEmbed.thumbnail?.url)
                    .setFooter({text: oldEmbed.footer?.text, iconURL: oldEmbed.footer?.iconURL})
                    .setTimestamp();

                oldEmbed.fields.forEach(field => {
                    newEmbed.addFields({name: field.name, value: field.value, inline: field.inline});
                });

                await mentionedUser.send({ embeds: [newEmbed] });
            } else {
                messageContent = firstArg + ' ' + messageContent;
                await mentionedUser.send(messageContent);
            }
            message.channel.send(await client.lang('mp.send'));
        } catch (error) {
            message.channel.send(await client.lang('mp.erreur'));
            console.log(error)
        }
    },
};
