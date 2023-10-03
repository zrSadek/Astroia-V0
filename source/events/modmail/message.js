const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const ms = require('ms');
const Discord = require('discord.js');

module.exports = {
    name: 'messageCreate',
    run: async (client, message) => {
        if (message.channel.type === 1) {
            if(message.content.toLowerCase() === '+close')return;
            if(message.author.id === client.user.id) return;
            const dbUser = client.db.get(`modmail_user_${message.author.id}`);
            if (!dbUser || !dbUser.channel)return;
            if (dbUser && dbUser.channel) {
                try {
                    const ticketChannel = await client.channels.fetch(dbUser.channel);
                    if (ticketChannel) {
                        const embed = new EmbedBuilder()
                            .setColor(client.config.default_color)
                            .setTitle(message.author.username)
                            .setDescription(message.content)
                            .setTimestamp()
                            .setFooter(client.footer);
                        message.channel.send(`\`✅\`Message envoyé.`)
                        ticketChannel.send({ embeds: [embed] });
                        client.db.set(`modmail_channel_${ticketChannel.id}`, message.author.id)
                    }
                } catch (error) {
                    console.error('Erreur lors de l\'envoi du message du DM vers le ticket :', error);
                }
            }
        }

        if (message.channel.type === 0) {
            if(message.author.id === client.user.id) return;
            const authorID = client.db.get(`modmail_channel_${message.channel.id}`);
            if (!authorID)return;
            if (authorID) {
                try {
                    const dmChannel = await client.users.fetch(authorID);
                    if (dmChannel) {
                        const embed = new EmbedBuilder()
                        .setColor(client.config.default_color)
                        .setTitle(message.author.username)
                        .setDescription(`${message.content || "Erreur"}`)
                        .setTimestamp()
                        .setFooter(client.footer);
                        dmChannel.send({embeds: [embed]});
                        message.channel.send(`\`✅\`Message envoyé.`)
                    }
                } catch (error) {
                    console.error('Erreur lors de l\'envoi du message du ticket vers le DM :', error);
                }
            }
        }
    }
};

