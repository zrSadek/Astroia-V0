const { ButtonStyle, ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'interactionCreate',
    run: async (client, interaction) => {
        if (!interaction.isButton()) return;

        const { customId, user } = interaction;
        const giveawayEntryRegex = /^giveaway_entry_/;

        if (customId.match(giveawayEntryRegex)) {
            const giveawayCode = customId.split('_')[2];

            const giveawayData = client.db.get(`giveaway_${interaction.guildId}_${giveawayCode}`);
            if (giveawayData) {
                if (!giveawayData.participant.includes(user.id)) {
                    giveawayData.participant.push(user.id);
                    client.db.set(`giveaway_${interaction.guildId}_${giveawayCode}`, giveawayData);
                    interaction.reply({ content: "Vous participez maintenant au giveaway !", ephemeral: true });
                    await update(giveawayData, interaction, client, giveawayCode);
                } else {
                    const leaveButton = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId(`giveaway_leave_${giveawayCode}`)
                                .setLabel("Quitter")
                                .setStyle(ButtonStyle.Danger)
                        );

                    interaction.reply({
                        content: "Vous participez déjà à ce giveaway.",
                        ephemeral: true,
                        components: [leaveButton]
                    });
                }
            }
        }

        if (customId.startsWith('giveaway_list_')) {
            const giveawayCode = customId.split('_')[2];
            const giveawayData = client.db.get(`giveaway_${interaction.guildId}_${giveawayCode}`);
            if (giveawayData) {
                const participants = giveawayData.participant;
                if (participants.length > 0) {
                    const participantInfo = await Promise.all(participants.map(async id => {
                        const user = await client.users.fetch(id);
                        return `${user.username} (ID: ${user.id})`;
                    }));
                    const participantList = participantInfo.join('\n');
                    interaction.reply({ content: `Participants du giveaway :\n\`\`\`yml\n${participantList}\`\`\``, ephemeral: true });
                } else {
                    interaction.reply({ content: "Aucun participant pour le moment.", ephemeral: true });
                }
            }
        }

        if (customId.startsWith('giveaway_leave_')) {
            const giveawayCode = customId.split('_')[2];

            const giveawayData = client.db.get(`giveaway_${interaction.guildId}_${giveawayCode}`);
            if (giveawayData) {
                const index = giveawayData.participant.indexOf(user.id);
                if (index !== -1) {
                    giveawayData.participant.splice(index, 1);
                    client.db.set(`giveaway_${interaction.guildId}_${giveawayCode}`, giveawayData);
                    interaction.update({ content: "Vous avez quitté le giveaway.", components: [], ephemeral: true });
                    await update(giveawayData, interaction, client, giveawayCode);
                }
            }
        }
    }
};

async function update(giveawayData, interaction, client, giveawayCode) {
    const color = client.db.get(`color_${interaction.guild.id}`) || client.config.default_color;
    const participantsCount = giveawayData.participant.length || 0;
    const embed = new EmbedBuilder()
        .setTitle('Giveaway')
        .setDescription(`Prix : \`${giveawayData.prix}\`\nFini : <t:${Math.floor(giveawayData.temps / 1000)}:R>\nLancée par : <@${giveawayData.host}>\nParticipant : \`${participantsCount} participants\``)
        .setFooter(client.footer)
        .setColor(color)
        .setTimestamp();
    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setEmoji(giveawayData.emoji)
                .setCustomId('giveaway_entry_' + giveawayCode)
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setLabel('Liste des participants')
                .setCustomId('giveaway_list_' + giveawayCode)
                .setStyle(ButtonStyle.Secondary)
        );
    const msg = giveawayData.messageid;
    const giveawayMessage = await interaction.channel.messages.fetch(msg);

    giveawayMessage.edit({ embeds: [embed], components: [row], content: null });
}


