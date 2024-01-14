const db = require('quick.db');
const ms = require('ms');
const Discord = require('discord.js');


module.exports = {
    name: 'ready',
    run: async (client) => {

        setInterval(async () => {
            const giveawayKeys = await db.all();
            const now = Date.now();

            for (const giveawayKey of giveawayKeys) {
                if (giveawayKey.ID.startsWith('giveaway_')) {
                    const [, guildId, code] = giveawayKey.ID.split('_');
                    const giveawayData = giveawayKey.data && JSON.parse(giveawayKey.data);
                    if (!giveawayData.ended && giveawayData.temps) {
                        const endTime = giveawayData.temps;
                        if (endTime <= now) {
                            const guild = client.guilds.cache.get(guildId);
                            const giveawayChannel = guild.channels.cache.get(giveawayData.channel);
                            const participants = giveawayData.participant;
                            const message = await giveawayChannel.messages.fetch(giveawayData.messageid);
                            if(!message)return;
                            if (participants.length === 0) {
                                if (guild) {
                                    if (giveawayChannel) {
                                        const embed = new Discord.EmbedBuilder(message.embeds[0]);
                                        embed.setTitle('Giveaway Terminé');
                                        embed.setDescription('Aucun participant. Le giveaway a été annulé.');
                                        const row = new Discord.ActionRowBuilder()
                                            .addComponents(
                                                new Discord.ButtonBuilder()
                                                    .setEmoji(giveawayData.emoji)
                                                    .setCustomId('giveaway_entry_' + code)
                                                    .setDisabled(true)
                                                    .setStyle(Discord.ButtonStyle.Primary),
                                                new Discord.ButtonBuilder()
                                                    .setLabel('Liste des participants')
                                                    .setDisabled(true)
                                                    .setCustomId('giveaway_list_' + code)
                                                    .setStyle(Discord.ButtonStyle.Secondary)
                                            );
                                        await message.edit({ embeds: [embed], components: [row] });

                                        giveawayData.ended = true;
                                        client.db.set(`giveaway_${guildId}_${code}`, JSON.stringify(giveawayData));
                                    }
                                }
                            } else {
                                const winners = [];

                                if (giveawayData.predef && giveawayData.predef.length > 0) {
                                    const numberOfPredefinedWinners = Math.min(giveawayData.predef.length, giveawayData.gagnant || 1);
                                    for (let i = 0; i < numberOfPredefinedWinners; i++) {
                                        const predefinedWinnerId = giveawayData.predef[i];
                                        const winnerMember = await client.users.fetch(predefinedWinnerId);
                                        winners.push(`<@${winnerMember.id}>`);
                                    }
                                }
                                
                                const guild = client.guilds.cache.get(guildId);

                                const remainingWinners = Math.max(0, (giveawayData.gagnant || 1) - winners.length);
                                for (let i = 0; i < remainingWinners; i++) {
                                    if (participants.length === 0) break;
                                    const winnerIndex = Math.floor(Math.random() * participants.length);
                                    const winnerId = participants.splice(winnerIndex, 1)[0];
                                    const winnerMember = await client.users.fetch(winnerId);
                                    const memberGuild = guild.members.cache.get(winnerMember.id);
                                    if (!giveawayData.vocal || (giveawayData.vocal && memberGuild.voice.channel)) {
                                        winners.push(`<@${winnerMember.id}>`);
                                    }
                                }

                                if (guild) {
                                    const giveawayChannel = guild.channels.cache.get(giveawayData.channel);
                                    if (giveawayChannel) {
                                        const message = await giveawayChannel.messages.fetch(giveawayData.messageid);
                                        if (winners.length === 0) {
                                            const embed = new Discord.EmbedBuilder(message.embeds[0]);
                                            embed.setTitle('Giveaway Terminé');
                                            embed.setDescription("Aucune personne n'a respecter les conditions du giveaway");
                                            const row = new Discord.ActionRowBuilder()
                                                .addComponents(
                                                    new Discord.ButtonBuilder()
                                                        .setEmoji(giveawayData.emoji)
                                                        .setCustomId('giveaway_entry_' + code)
                                                        .setDisabled(true)
                                                        .setStyle(Discord.ButtonStyle.Primary),
                                                    new Discord.ButtonBuilder()
                                                        .setLabel('Liste des participants')
                                                        .setDisabled(true)
                                                        .setCustomId('giveaway_list_' + code)
                                                        .setStyle(Discord.ButtonStyle.Secondary)
                                                );
                                            await message.edit({ embeds: [embed], components: [row] });
                                            message.reply("Aucune personne n'a respecter les conditions du giveaway")
                                            giveawayData.ended = true;
                                            client.db.set(`giveaway_${guildId}_${code}`, giveawayData);
                                            break;
                                        }
                                        const embed = new Discord.EmbedBuilder(message.embeds[0]);
                                        embed.setTitle('Giveaway Terminé');
                                        embed.setDescription(`Félicitations ${winners.join(', ')} ! Vous avez gagné le ${giveawayData.prix}`);
                                        const row = new Discord.ActionRowBuilder()
                                            .addComponents(
                                                new Discord.ButtonBuilder()
                                                    .setEmoji(giveawayData.emoji)
                                                    .setCustomId('giveaway_entry_' + code)
                                                    .setDisabled(true)
                                                    .setStyle(Discord.ButtonStyle.Primary),
                                                new Discord.ButtonBuilder()
                                                    .setLabel('Liste des participants')
                                                    .setDisabled(true)
                                                    .setCustomId('giveaway_list_' + code)
                                                    .setStyle(Discord.ButtonStyle.Secondary)
                                            );
                                            message.reply(`Félicitations ${winners.join(', ')} ! Vous avez gagné le ${giveawayData.prix}`)
                                        await message.edit({ embeds: [embed], components: [row] });

                                        giveawayData.ended = true;
                                        client.db.set(`giveaway_${guildId}_${code}`, JSON.stringify(giveawayData));
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }, 1000);
    }
};

