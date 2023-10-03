const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'messageUpdate',
    run: async (client, oldMessage, newMessage) => {
        if (newMessage.author.bot) return;
        if (newMessage.author.id === client.user.id) return;
        if (!oldMessage.guild) return;


        let channel = client.db.get(`msglogs_${oldMessage.guild.id}`);
        if (!channel) return;
        let chan = oldMessage.guild.channels.cache.get(channel);
        if (!chan) return;
        let ignored = client.db.get(`msglogs_allow_${oldMessage.channel.id}`);
        if (ignored === true) return;
        
        
        let Embed = new Discord.EmbedBuilder()
            .setColor(client.color)
            .setAuthor({ name: await client.lang('msglog.message9') + oldMessage.author.username, iconURL: oldMessage.author.displayAvatarURL() })
            .setDescription(`
**${await client.lang('msglog.message13')} [\`${oldMessage.channel.name}\`](https://discord.com/channels/${oldMessage.guild.id}/${oldMessage.channel.id})**
**${await client.lang('msglog.message14')}:** \`\`\`yml\n${oldMessage.content}\`\`\`
**${await client.lang('msglog.message15')}:** \`\`\`yml\n${newMessage.content}\`\`\`
`)
            .setTimestamp();
        chan.send({ embeds: [Embed] });

    }
};
