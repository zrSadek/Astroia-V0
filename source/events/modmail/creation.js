const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const ms = require('ms');
const Discord = require('discord.js');
module.exports = {
    name: 'messageCreate',
    run: async (client, message) => {
        if (message.channel.type === 1) {
            if (message.content.toLowerCase().startsWith('+close')) {
                const dbUser = client.db.get(`modmail_user_${message.author.id}`);
                if (!dbUser || !dbUser?.channel) {
                    message.reply({ content: 'Vous n\'avez pas de ticket ouvert.', ephemeral: true });
                    return;
                }

                try {
                    const ticketChannel = await client.channels.fetch(dbUser?.channel);
                        ticketChannel.delete();
                        client.db.delete(`modmail_user_${message.author.id}`);
                        message.reply({ content: 'Votre ticket a été fermé avec succès.', ephemeral: true });
                   
                } catch (error) {
                    console.error('Erreur lors de la fermeture du ticket :', error);
                    message.reply({ content: 'Une erreur s\'est produite lors de la fermeture du ticket.', ephemeral: true });
                }
            }
        
           else if (message.content.toLowerCase() === '+open') {
                const userGuilds = client.guilds.cache.filter(guild => guild.members.cache.has(message.author.id));
                const guildOptions = userGuilds.map(guild => ({
                    label: guild.name,
                    value: guild.id,
                }));

                const selectMenu = new StringSelectMenuBuilder()
                    .setCustomId('guild_selection_' + message.id)
                    .setPlaceholder('Sélectionnez un serveur')
                    .addOptions(guildOptions);

                const row = new ActionRowBuilder()
                    .addComponents(selectMenu);

                const embed = new EmbedBuilder()
                    .setColor(client.config.default_color)
                    .setTitle(`Merci de sélectionner un serveur pour ouvrir un ticket`)
                    .setFooter(client.footer);

                const msg = await message.channel.send({ embeds: [embed], components: [row] });

                const filter = (interaction) => interaction.user.id === message.author.id && interaction.customId === 'guild_selection_' + message.id;
                const collector = message.channel.createMessageComponentCollector({ filter, time: ms('2m') });

                collector.on('collect', async (interaction) => {
                    const chosenGuildId = interaction.values[0];
                    const guild = client.guilds.cache.get(chosenGuildId);

                    if (!guild) {
                        console.log(`La guilde est invalide : ${chosenGuildId}`);
                        msg.edit({ content: await client.lang('erreur'), embeds: [], components: [] });
                        return;
                    }

                    if (!guild.members.cache.has(client.user.id)) {
                        msg.edit({ content: await client.lang('erreur'), embeds: [], components: [] });
                        return;
                    }
                    const db = client.db.get(`modmail_${guild.id}`);
                    const status = db?.status;


                    try {
                        const dbuser = client.db.get(`modmail_user_${interaction.user.id}`);
                        if (dbuser && dbuser.channel) {
                            interaction.reply({ content: "Vous avez déjà un modmail ouvert. Veuillez le fermer avant d'en ouvrir un nouveau.", ephemeral: true });
                            msg.edit({ content: 'Vous avez déjà un ticket ouvert. Veuillez le fermer avant d\'en ouvrir un nouveau.', embeds: [], components: [] });
                            return;
                        }

                        if (status === false || status === null) {
                            interaction.reply({ content: "Le serveur n'a pas activé le modmail !", ephemeral: true });
                        }
                        if (status === true) {
                            const ticketChannel = await guild.channels.create({
                                type: Discord.ChannelType.GuildText,
                                parent: db.categorie,
                                name: 'ModMail-' + message.author.username.toLowerCase(),
                                topic: `ModMail créé par ${interaction.user.username} | ${interaction.user.id}`,
                                permissionOverwrites: [
                                    {
                                        id: guild.roles.everyone,
                                        deny: [Discord.PermissionFlagsBits.ViewChannel],
                                    },
                                    {
                                        id: client.user.id,
                                        allow: [Discord.PermissionFlagsBits.ViewChannel, Discord.PermissionFlagsBits.SendMessages],
                                    },
                                    {
                                        id: interaction.user.id,
                                        deny: [Discord.PermissionFlagsBits.ViewChannel, Discord.PermissionFlagsBits.SendMessages],
                                    },
                                ],
                            });
                            const modRoles = db?.modérateur;
                            if (modRoles && modRoles.length > 0) {
                                for (const roleId of modRoles) {
                                    const role = guild.roles.cache.get(roleId);
                                    if (role) {
                                        ticketChannel.permissionOverwrites.edit(role, {
                                            SendMessages: true,
                                            ViewChannel: true

                                        });
                                    }
                                }
                            }

                            interaction.reply({ content: 'Ticket ouvert avec succès !', ephemeral: true });
                            client.db.set(`modmail_user_${interaction.user.id}`, {
                                channel: ticketChannel.id,
                                status: true,
                            });
                            
                            msg.edit({ content: 'Votre ticket est maintenant ouvert, tout les messages que vous allez envoyer ici seront transmis.`+close` pour fermer votre ticket.', embeds: [], components: [] });
                            const buttons = new Discord.ButtonBuilder()
                            .setCustomId('modmail-fermer')
                            .setLabel('Fermer le ticket')
                            .setStyle(Discord.ButtonStyle.Danger)
                            const row = new Discord.ActionRowBuilder()
                            .addComponents(buttons)
                            ticketChannel.send({content: 'ticket ouvert par : <@' + interaction.user.id + '>', components: [row]})
                            client.db.set(`modmail_channel_${ticketChannel.id}`, interaction.user.id)
                        } else {
                            interaction.reply({ content: "Le serveur n'a pas activé le modmail !", ephemeral: true });

                        }
                    } catch (error) {
                        console.error('Erreur lors de la création du ticket :', error);
                        interaction.reply({ content: "Une erreur s'est produite lors de la création du ticket. Veuillez réessayer la commande `+open`.", ephemeral: true });
                        msg.edit({ content: 'Une erreur s\'est produite lors de la création du ticket. Veuillez réessayer la commande `+open`.', embeds: [], components: [] });
                    }

                });

                collector.on('end', (collected, reason) => {
                    if (reason === 'time') {
                        msg.edit({ content: 'Le temps d\'attente est écoulé, veuillez refaire la commande `+open`.', embeds: [], components: [] });
                    }
                });
            }
        }
    }
};

