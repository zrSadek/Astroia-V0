const { Astroia } = require('../../structures/client');
const Discord = require('discord.js');

module.exports = {
    name: 'messageDelete',
    /**
     * 
     * @param {Astroia} client 
     * @param {Astroia} message 
     * @returns 
     */
    run: async (client, message) => {
        if (!message || !message.author || !message.guild) {
            return;
        }
        
        if (message.author.id === client.user.id) {
            return;
        }

        let channel = client.db.get(`msglogs_${message.guild.id}`);
        if (!channel) return;
        let chan = message.guild.channels.cache.get(channel);
        if (!chan) return;
        let ignored = client.db.get(`msglogs_allow_${message.channel.id}`);
        if (ignored === true) return;

        let action = await message.guild.fetchAuditLogs({ limit: 1, type: 72 }).then(async (audit) => audit.entries.first());
        let executor = action ? action.executor : message.author || await client.lang(`msglog.message10`);

        let msg;
        if (action) {
            msg = `**${executor} ${await client.lang('msglog.message7')}** [${message.channel.name}](https://discord.com/channels/${message.guild.id}/${message.channel.id})
            \`\`\`${message.content || await client.lang(`msglog.message11`)}\`\`\``;
        } else {
            msg = `**${await client.lang('msglog.message8')}** [${message.channel.name}](https://discord.com/channels/${message.guild.id}/${message.channel.id}
\`\`\`\`${message.content || await client.lang(`msglog.message11`)}\`\`\``;
        }

        if (message.embeds.length > 0) {
            const embed = message.embeds[0];
            const messages = await client.lang('msglog.message12');
            const replacedChannel = messages.replace(/{channel.name}/g, message.channel.name).replace(/{channel.id}/g, message.guild.id);

            chan.send({ content: replacedChannel, embeds: [embed] });
        }


        let Embed = new Discord.EmbedBuilder()
            .setColor(client.color)
            .setAuthor({ name: await client.lang(`msglog.message9`) + message.author.username, iconURL: message.author.displayAvatarURL() })
            .setDescription(msg)
            .setTimestamp();
        chan.send({ embeds: [Embed] });
    }
};
