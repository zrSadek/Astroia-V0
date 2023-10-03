const { EmbedBuilder } = require("discord.js");
const { Astroia } = require("../../structures/client/index");
const ms = require('ms');

module.exports = {
    name: 'messageCreate',
    run: async (client, message) => {
        if (message.author.id === client.user.id) return;

        const guild = message.guild;
        if (!guild) return;
        const antilink = client.db.get(`antilink_${message.guild.id}`);
        if (!antilink) return;
        const status = antilink.status;
        const ignore = antilink.ignore;
        const lien = antilink.lien;
        const sanction = antilink.sanction;

         if(message.author.id === guild.ownerId)return; 
          if (client.config.buyers.includes(message.author.id)) return;
          if (message.author.id === client.db.get(`owner_${message.author.id}`)) return;
          if (client.db.get(`owner_${message.author.id}`) === true) return;

          const wl = client.db.get(`wl.${message.guild.id}`) || [guild.ownerId];
          const isWhitelisted = wl.includes(message.author.id);

        if (status === 'off') return;
        if (ignore.includes(message.channel.id)) return;
        if(isWhitelisted === true)return; 
        const discordInviteRegex = /(https:\/\/)?(www\.)?(discord\.gg|discord\.me|discordapp\.com\/invite|discord\.com\/invite)\/([a-z0-9-.]+)?/i;
        const allLinksRegex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
        const containsDiscordInvite = discordInviteRegex.test(message.content);
        const containsAllLinks = allLinksRegex.test(message.content);

        if ((lien === 'invites' && containsDiscordInvite) || (lien === 'all' && containsAllLinks || containsDiscordInvite)) {
            sanction.forEach(async (action) => {
                const embed = new EmbedBuilder()
            const punish =  await client.db.get(`punish_${guild.id}.antilink`)
            message.delete().catch(() => { });
            message.channel.send(`${message.author}, ${await client.lang(`antilink.not`)}`).then((m) => setTimeout(() => m.delete(), 1000)).catch(() => { });
            
            if(!punish)return;
            if (punish === "mute") {
                const reason = 'Astroia AntiLink';
                await message.member.timeout(ms('5s'), reason).catch(() => { });
            }
            if (punish === "kick") {
                const member = message.member;
                if (member) {
                    const reason = 'Astroia AntiLink';
                    await member.kick(reason).catch(() => { });
                }
            }

            if (punish === "ban") {
                const member = message.member;
                if (member) {
                    const reason = 'Astroia AntiLink';
                    await member.ban({ reason }).catch(() => { });
                }
            }

        });
    }
}
}
