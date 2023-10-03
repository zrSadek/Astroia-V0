const Discord = require('discord.js');

module.exports = {
    name: 'voiceStateUpdate',
    run: async (client, oldMember, newMember) => {
        const color = client.db.get(`color_${newMember.guild.id}`) || client.config.default_color;
        const guild = newMember.guild;
        if (!guild) return;
        if(newMember.id === client.user.id)return;
        if (newMember.serverMute === true) return;
        if (newMember.serverDeaf === true) return;
        const channel = client.db.get(`voicelogs_${guild.id}`);
        if (!channel) return;

        let userStat = '';
        const chan = newMember.guild.channels.cache.get(channel);
        if (!chan) return;
        const user = await client.users.fetch(newMember.id)

        if (!oldMember.channelId && newMember.channelId) {
            const newChannel = await client.channels.fetch(newMember.channelId);

            const userStat = `[\`${user.username}\`](https://discord.com/users/${newMember.id}) (\`${newMember.id}\`) ${await client.lang('vocallog.joins')} [\`${newChannel.name}\`](https://discord.com/channels/${guild.id}/${newChannel.id}) (\`${newChannel.id}\`)`;

            const Embed = new Discord.EmbedBuilder()
                .setColor(color)
                .setAuthor({ name: user.username, iconURL: user.avatarURL() })
                .setDescription(userStat)
                .setFooter(client.footer)
                .setTimestamp();

            return chan.send({ embeds: [Embed] });
        }

        if (oldMember.channelId && !newMember.channelId) {
            const oldChannel = await client.channels.fetch(oldMember.channelId);

            const userStat = `[\`${user.username}\`](https://discord.com/users/${oldMember.id}) (\`${oldMember.id}\`) ${await client.lang('vocallog.leave')} [\`${oldChannel.name}\`](https://discord.com/channels/${guild.id}/${oldChannel.id}) (\`${oldChannel.id}\`)`;

            const Embed = new Discord.EmbedBuilder()
                .setColor(color)
                .setAuthor({ name: user.username, iconURL: user.avatarURL() })
                .setDescription(userStat)
                .setFooter(client.footer)
                .setTimestamp();

            return chan.send({ embeds: [Embed] });
        }
        const oldchan = oldMember.channel;

        const oldChannels = await client.channels.fetch(oldMember.channelId)

        if (oldMember.mute !== newMember.mute) {
            userStat = `[\`${(await client.users.fetch(oldMember.id)).username}\`](https://discord.com/users/${oldMember.id}) (\`${oldMember.id}\`) ${await client.lang('vocallog.viens')} \`${newMember.mute ? await client.lang('vocallog.mute') : await client.lang('vocallog.unmute')} ${await client.lang('vocallog.micro')}\` ${await client.lang('vocallog.dans')} [\`${oldChannels.name}\`](https://discord.com/channels/${guild.id}/${oldchan.id}) (\`${oldchan.id}\`)`;
        }

        if (oldMember.selfDeaf !== newMember.selfDeaf || oldMember.serverDeaf !== newMember.serverDeaf) {
            userStat = `[\`${(await client.users.fetch(oldMember.id)).username}\`](https://discord.com/users/${oldMember.id}) (\`${oldMember.id}\`) ${await client.lang('vocallog.viens')} \`${newMember.selfDeaf ? await client.lang('vocallog.mute') : await client.lang('vocallog.unmute')} ${await client.lang('vocallog.casque')}\` ${await client.lang('vocallog.dans')} [\`${oldChannels.name}\`](https://discord.com/channels/${guild.id}/${oldchan.id}) (\`${oldchan.id}\`)`;
        }
        if (oldMember.streaming !== newMember.streaming) {
            userStat = `[\`${user.username}\`](https://discord.com/users/${oldMember.id}) (\`${oldMember.id}\`) ${await client.lang('vocallog.maintenant')} \`${newMember.streaming ? await client.lang('vocallog.stream') : await client.lang('vocallog.unstream')}\` ${await client.lang('vocallog.dans')} [\`${oldChannels.name}\`](https://discord.com/channels/${guild.id}/${oldchan.id}) (\`${oldchan.id}\`)`;
        }

        if (oldMember.channelId !== newMember.channelId) {
            const oldChannel = await client.channels.fetch(oldMember.channelId);
            const newChannel = await client.channels.fetch(newMember.channelId);
            userStat = `[\`${(await client.users.fetch(oldMember.id)).username}\`](https://discord.com/users/${oldMember.id}) (\`${oldMember.id}\`) ${await client.lang('vocallog.message8')} [\`${oldChannel.name}\`](https://discord.com/channels/${guild.id}/${oldChannel.id}) ${await client.lang('vocallog.message9')} [\`${newChannel.name}\`](https://discord.com/channels/${guild.id}/${newChannel.id}) (\`${newChannel.id}\`)`;
        }

        const Embed = new Discord.EmbedBuilder()
            .setColor(color)
            .setAuthor({ name: user.username, iconURL: user.avatarURL() })
            .setDescription(userStat)
            .setFooter(client.footer)
            .setTimestamp();

        chan.send({ embeds: [Embed] });
    },
};
