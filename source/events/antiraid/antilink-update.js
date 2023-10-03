const { MessageEmbed } = require("discord.js");
const { Astroia } = require("../../structures/client/index");
const ms = require('ms');

module.exports = {
    name: 'messageUpdate',
    run: async (client, oldMessage, newMessage) => {
        if (newMessage.author.id === client.user.id) return;

        const guild = newMessage.guild;
        if (!guild) return;
        const antilink = client.db.get(`antilink_${newMessage.guild.id}`);
        if (!antilink) return;
        const status = antilink.status;
        const ignore = antilink.ignore;
        const lien = antilink.lien;
        const sanction = antilink.sanction;

        if (newMessage.author.id === guild.ownerId) return;
        if (client.config.buyers.includes(newMessage.author.id)) return;
        if (newMessage.author.id === client.db.get(`owner_${newMessage.author.id}`)) return;
        if (client.db.get(`owner_${newMessage.author.id}`) === true) return;

        const wl = client.db.get(`wl.${newMessage.guild.id}`) || [guild.ownerId];
        const isWhitelisted = wl.includes(newMessage.author.id);

        if (status === 'off') return;
        if (ignore.includes(newMessage.channel.id)) return;
        if (isWhitelisted === true) return;
        const discordInviteRegex = /(https:\/\/)?(www\.)?(discord\.gg|discord\.me|discordapp\.com\/invite|discord\.com\/invite)\/([a-z0-9-.]+)?/i;
        const allLinksRegex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
        const containsDiscordInvite = discordInviteRegex.test(newMessage.content);
        const containsAllLinks = allLinksRegex.test(newMessage.content);

        if ((lien === 'invites' && containsDiscordInvite) || (lien === 'all' && (containsAllLinks || containsDiscordInvite))) {
            sanction.forEach(async (action) => {
                const punish = await client.db.get(`punish_${guild.id}.antilink`)
                newMessage.delete().catch(() => { });
                newMessage.channel.send(`${newMessage.author}, ${await client.lang(`antilink.not`)}`).then((m) => setTimeout(() => m.delete(), 1000)).catch(() => { });

                if (!punish) return;
                if (punish === "mute") {
                    const reason = 'Astroia AntiLink';
                    await newMessage.member.timeout(ms('5s'), reason).catch(() => { });
                }
                if (punish === "kick") {
                    const member = newMessage.member;
                    if (member) {
                        const reason = 'Astroia AntiLink';
                        await member.kick(reason).catch(() => { });
                    }
                }

                if (punish === "ban") {
                    const member = newMessage.member;
                    if (member) {
                        const reason = 'Astroia AntiLink';
                        await member.ban({ reason }).catch(() => { });
                    }
                }
            });
        }
    }
}
