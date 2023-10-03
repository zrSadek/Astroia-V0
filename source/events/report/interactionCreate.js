const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'interactionCreate',
    run: async (client, interaction) => {
        if (interaction.isMessageContextMenuCommand() && interaction.commandName === 'report') {
            const reportedMessageContent = interaction.targetMessage.content;
            const reportingUser = interaction.user;
            const reportedMessageLink = `https://discord.com/channels/${interaction.guild.id}/${interaction.targetMessage.channelId}/${interaction.targetMessage.id}`;
            const reportTime = new Date();

            const db = client.db.get(`report_${interaction.guild.id}`);
            if (!db || db.status !== true || !db.channel) {
                await interaction.reply({ content: 'La fonctionnalité de signalement n\'est pas correctement configurée sur ce serveur.', ephemeral: true });
                return;
            }

            const requiredRoles = db.role;
            if (requiredRoles && requiredRoles.length > 0) {
                const member = interaction.guild.members.cache.get(interaction.user.id);
                const hasRequiredRole = requiredRoles.some((roleId) => member.roles.cache.has(roleId));

                if (!hasRequiredRole) {
                    await interaction.reply({ content: 'Vous n\'avez pas le rôle requis pour effectuer un signalement.', ephemeral: true });
                    return;
                }
            }
       
            const color = client.db.get(`color_${interaction.guild.id}`) || client.config.default_color
            const reportChannel = interaction.guild.channels.cache.get(db.channel);
            const reportedUser = interaction.guild.members.cache.get(interaction.targetMessage.author.id);

            const embed = new EmbedBuilder()
                .setColor(color)
                .setTitle('Signalement de ' + interaction.user.username)
                .addFields({ name: 'Contenu du message :', value: `\`\`\`yml\n${reportedMessageContent || "Embed Report ou image donc invalide."}\`\`\`` })
                .addFields({ name: 'Signalé par', value: `\`\`\`yml\n${reportingUser.tag} - (${reportingUser.id})\`\`\`` })
                .addFields({ name: 'Personne concernée :', value: `\`\`\`yml\n${reportedUser.user.username} - (${reportedUser.id})\`\`\`` })
                .addFields({ name: 'Bot :', value: `\`\`\`yml\n${reportedUser.user.bot ? '✅' : '❌'}\`\`\`` })
                .addFields({ name: 'Lien du message', value: `[[\`Clique ici\`]](${reportedMessageLink})` })
                .addFields({ name: 'Date', value: `<t:${Math.floor(reportTime / 1000)}:D> à <t:${Math.floor(reportTime / 1000)}:T> (<t:${Math.floor(reportTime / 1000)}:R>)` })
                .setFooter(client.footer)
            await reportChannel.send({ embeds: [embed] });

            await interaction.reply({ content: 'Votre report a bien été pris en compte !', ephemeral: true });
        }
    },
};
