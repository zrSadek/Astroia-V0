const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'guildMemberUpdate',
    /**
     * @param {Astroia} client 
     * @param {Astroia} oldMember 
     * @param {Astroia} newMember 
     * @returns 
     */
    run: async (client, oldMember, newMember) => {
        const color = client.db.get(`color_${newMember.guild.id}`) || client.config.default_color
        const newBoosting = newMember.premiumSince !== null;
        const channel = await client.db.get(`boostlog_${newMember.guild.id}`)
        if (!channel) return;
        if (newBoosting) {
            const boostChannel = client.channels.cache.get(channel);
            if (boostChannel) {
                const embed = new EmbedBuilder()
                    .setColor(color)
                    .setFooter(client.footer)
                    .setDescription(`[\`${newMember.user.username}\`](https://discord.com/users/${newMember.user.id}) (\`${newMember.user.id}\`) vient de booster, il y a maintenant \`${newMember.guild.premiumSubscriptionCount}\` boost au total.`);

                boostChannel.send({ embeds: [embed] });
            }
        }
    }
}
