const Discord = require('discord.js');
const ms = require('ms')
module.exports = {
    name: "embed",
    aliases: ["embedbuilder"],
    description: "Permet de créer un embed personnalisé",
    usage: ["embed"],
    run: async (client, message, args, color, prefix, footer, commandName) => {

        let pass = false

        let staff = client.staff

        if (!staff.includes(message.author.id) && !client.config.buyers.includes(message.author.id) && client.db.get(`owner_${message.author.id}`) !== true) {
            if (client.db.get(`perm_${commandName}.${message.guild.id}`) === "1" && message.member.roles.cache.some(r => client.db.get(`perm1.${message.guild.id}`)?.includes(r.id))) pass = true;
            if (client.db.get(`perm_${commandName}.${message.guild.id}`) === "2" && message.member.roles.cache.some(r => client.db.get(`perm2.${message.guild.id}`)?.includes(r.id))) pass = true;
            if (client.db.get(`perm_${commandName}.${message.guild.id}`) === "3" && message.member.roles.cache.some(r => client.db.get(`perm3.${message.guild.id}`)?.includes(r.id))) pass = true;
            if (client.db.get(`perm_${commandName}.${message.guild.id}`) === "4" && message.member.roles.cache.some(r => client.db.get(`perm4.${message.guild.id}`)?.includes(r.id))) pass = true;
            if (client.db.get(`perm_${commandName}.${message.guild.id}`) === "5" && message.member.roles.cache.some(r => client.db.get(`perm5.${message.guild.id}`)?.includes(r.id))) pass = true;
            if (client.db.get(`perm_${commandName}.${message.guild.id}`) === "public") pass = true;
        } else pass = true;

        if (pass === false) return message.channel.send(`perm`)


        const row = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.StringSelectMenuBuilder()
                    .setCustomId("embedselect_" + message.id)
                    .setPlaceholder("Clique ici pour modifier l'embed")
                    .addOptions([
                        {
                            label: "Titre",
                            value: "title_" + message.id,
                            emoji: "✏️"
                        },
                        {
                            label: "Description",
                            value: "description_" + message.id,
                            emoji: "💬"
                        },
                      /*  {
                            label: "Ajouter un Field", 
                            value: "fields_"+ message.id, 
                            emoji: "➕"
                        }, 
                        {
                            label: "Retirer un Field", 
                            value: "delfields_" + message.id,
                            emoji: "➖"
                        },*/
                        {
                            label: "Thumbnail",
                            value: "thumbnail_" + message.id,
                            emoji: "🏷️"
                        },
                        {
                            label: "Image",
                            value: "image_" + message.id,
                            emoji: "🖼️"
                        },
                        {
                            label: "Couleur",
                            value: "couleur_" + message.id,
                            emoji: "🔴"
                        },
                        {
                            label: "Footer",
                            value: "footer_" + message.id,
                            emoji: "🔻"
                        },
                        {
                            label: "Auteur",
                            value: "auteur_" + message.id,
                            emoji: "🔸"
                        },
                        {
                            label: "Timestamp",
                            value: "timestamp_" + message.id,
                            emoji: "🕐"
                        }
                    ])
        );
        const row2 = new Discord.ActionRowBuilder()
                            .addComponents(
                                new Discord.ButtonBuilder()
                                    .setCustomId("buttonenable_" + message.id)
                                    .setEmoji("✅")
                                    .setStyle(3),
                                new Discord.ButtonBuilder()
                                    .setCustomId("buttoncopy_" + message.id)
                                    .setLabel(await client.lang('embed.copyembed'))
                                    .setDisabled(true)
                                    .setStyle(3),
                                new Discord.ButtonBuilder()
                                    .setCustomId("buttondisable_" + message.id)
                                    .setEmoji("❌")
                                    .setStyle(2),
                              
                           
            );

        let embed = new Discord.EmbedBuilder()
            .setTitle("** **")

        message.channel.send({ embeds: [embed], components: [row, row2] }).then((msgembed) => {

            const collector = message.channel.createMessageComponentCollector({ filter: m => m.user.id == message.author.id, componentType: Discord.ComponentType.StringSelect, time: ms("2m") })

            collector.on('collect', async (interaction) => {
                if (interaction.values[0] === "title_" + message.id) {
                    interaction.reply(await client.lang(`embed.message15`));
                    message.channel.awaitMessages({ filter: m => m.author.id === message.author.id, max: 1, time: ms('2m'), errors: ["time"] }).then((collected) => {
                        collected.first().delete();
                        interaction.deleteReply();
                        embed.setTitle(collected.first().content)
                        msgembed.edit({ embeds: [embed] });
                    }).catch(async err => message.channel.send(await client.lang(`embed.time`)))
                }

                if (interaction.values[0] === "description_" + message.id) {
                    interaction.reply(await client.lang(`embed.message14`));
                    message.channel.awaitMessages({ filter: m => m.author.id === message.author.id, max: 1, time: ms('2m'), errors: ["time"] }).then(async (collected) => {
                        collected.first().delete();
                        interaction.deleteReply();
                        embed.setDescription(`${collected.first().content}`)
                        msgembed.edit({ embeds: [embed] });
                    }).catch(async err => {
                        interaction.reply(await client.lang(`embed.time`));
                        interaction.deleteReply();
                    }).catch(async err => message.channel.send(await client.lang(`embed.time`)))
                }
                if (interaction.values[0] === "thumbnail_" + message.id) {
                    interaction.reply(await client.lang(`embed.message12`));
                    message.channel.awaitMessages({ filter: m => m.author.id === message.author.id, max: 1, time: ms('2m'), errors: ["time"] }).then(async (collected) => {
                        let image = collected.first().attachments.first()?.url;
                        if (!image) {
                            interaction.deleteReply();
                            collected.first().delete();
                            return message.channel.send(await client.lang(`embed.link`));
                        }
                        collected.first().delete();
                        interaction.deleteReply();
                        embed.setThumbnail(image)
                        msgembed.edit({ embeds: [embed] });
                    }).catch(async err => message.channel.send(await client.lang(`embed.time`)))
                }
                if (interaction.values[0] === "image_" + message.id) {
                    interaction.reply(await client.lang(`embed.message13`));
                    message.channel.awaitMessages({ filter: m => m.author.id === message.author.id, max: 1, time: ms('2m'), errors: ["time"] }).then(async (collected) => {
                        let image = collected.first().attachments.first()?.url;
                        if (!image) {
                            message.channel.send(await client.lang(`embed.link`));
                            message.delete();
                        }
                        interaction.deleteReply();
                        collected.first().delete();
                        embed.setImage(image)
                        msgembed.edit({ embeds: [embed] });
                    }).catch(async err => message.channel.send(await client.lang(`embed.time`)))
                }
                if (interaction.values[0] === "couleur_" + message.id) {
                    interaction.reply(await client.lang(`embed.message11`));

                    const filter = m => m.author.id === message.author.id;
                    message.channel.awaitMessages({ filter, max: 1, time: ms('2m'), errors: ["time"] })
                        .then(async (collected) => {
                            interaction.deleteReply();
                            const content = collected.first().content.toLowerCase(); 

                            const colors = {
                                "noir": "#000000",
                                "black": "#000000",
                                "blanc": "#ffffff",
                                "white": "#ffffff",
                                "jaune": "#FFFF00",
                                "yellow": "#FFFF00",
                                "bleu": "#0000FF",
                                "blue": "#0000FF",
                                "violet": "#764686",
                                "purple": "#764686",
                                "gris": "#808080",
                                "gray": "#808080",
                                "grey": "#808080",
                                "orange": "#FFA500",
                                "vert": "#00FF00",
                                "green": "#00FF00",
                                "rouge": "#FF0000",
                                "red": "#FF0000",
                                "maron": "#582900",
                                "brown": "#582900",
                                "rose": "#dc14eb",
                                "pink": "#dc14eb",
                                "beige": "#F5F5DC"
                            };

                            const selectedColor = colors[content];

                            if (selectedColor) {
                                collected.first().delete().catch(() => { });
                                embed.setColor(selectedColor);
                                msgembed.edit({ embeds: [embed] });
                            } else {
                                collected.first().delete().catch(() => {});
                                embed.setColor(content);
                                msgembed.edit({ embeds: [embed] });
                            }
                        })
                        .catch(async err => message.channel.send(await client.lang(`embed.time`)));
                }
                if (interaction.values[0] === "footer_" + message.id) {
                    interaction.reply(await client.lang(`embed.message10`));
                    message.channel.awaitMessages({ filter: m => m.author.id === message.author.id, max: 1, time: ms('2m'), errors: ["time"] }).then(async (collected) => {
                        interaction.deleteReply();
                        collected.first().delete();
                        message.channel.send(await client.lang(`embed.message9`))
                        message.channel.awaitMessages({ filter: m => m.author.id === message.author.id, time: ms('2m'), errors: ["time"], max: 1 }).then(async (collected2) => {
                            message.delete();
                            collected2.first().delete();
                            if (collected2.first().content === await client.lang(`embed.aucun`)) {
                                message.delete();
                                embed.setFooter({ text: `${collected.first().content}` })
                                msgembed.edit({ embeds: [embed] });
                            } else {
                                let image = collected2.first().attachments.first()?.url;
                                if (!image) {
                                    message.channel.send(await client.lang(`embed.link`));
                                    message.delete();
                                }
                                embed.setFooter({ text: `${collected.first().content}`, iconURL: image })
                                msgembed.edit({ embeds: [embed] });
                            }
                        }).catch(async err => message.channel.send(await client.lang(`embed.time`)))
                    }).catch(async err => message.channel.send(await client.lang(`embed.time`)))
                }
                if (interaction.values[0] === "auteur_" + message.id) {
                    interaction.reply(await client.lang(`embed.message8`));
                    message.channel.awaitMessages({ filter: m => m.author.id === message.author.id, max: 1, time: ms('2m'), errors: ["time"] }).then(async (collected) => {
                        interaction.deleteReply();
                        collected.first().delete();
                        message.channel.send(await client.lang(`embed.message7`));
                        message.channel.awaitMessages({ filter: m => m.author.id === message.author.id, max: 1, time: ms('2m'), errors: ["time"] }).then(async (collected2) => {
                            message.delete();
                            collected2.first().delete();
                            if (collected2.first().content === await client.lang(`embed.aucun`)) {
                                embed.setAuthor({ name: `${collected.first().content}` })
                                msgembed.edit({ embeds: [embed] });
                            } else {
                                let image = collected2.first().attachments.first()?.url;
                                if (!image) {
                                    message.channel.send(await client.lang(`embed.link`));
                                    message.delete();
                                }
                                embed.setFooter({ text: `${collected.first().content}`, iconURL: image })
                                msgembed.edit({ embeds: [embed] });
                            }
                        }).catch(async err => message.channel.send(await client.lang(`embed.time`)))
                    }).catch(async err => message.channel.send(await client.lang(`embed.time`)))
                }
                if (interaction.values[0] === "fields_" + message.id) {
                    interaction.reply(await client.lang(`embed.message5`));
                    message.channel
                        .awaitMessages({
                            filter: (m) => m.author.id === message.author.id,
                            max: 1,
                            time: ms('2m'),
                            errors: ["time"],
                        })
                        .then(async (collected) => {
                            if (collected.first().content.length > 28) return message.channel.send(await client.lang(`embed.long`));
                            interaction.deleteReply();
                            collected.first().delete();
                            message.channel.send(await client.lang(`embed.message6`));
                            message.channel
                                .awaitMessages({
                                    filter: (m) => m.author.id === message.author.id,
                                    max: 1,
                                    time: ms('2m'),
                                    errors: ["time"],
                                })
                                .then(async (collect2) => {
                                    if (!message.deleted) message.delete();
                                    collect2.first().delete();
                                    embed.addFields({ name: `${collected.first().content}`, value: `${collect2.first().content}` });
                                    msgembed.edit({ embeds: [embed] });
                                })
                                .catch(async (err) => message.channel.send(await client.lang(`embed.time`)));
                        })
                        .catch(async (err) => message.channel.send(await client.lang(`embed.time`)));
                }

                if (interaction.values[0] === "delfields_" + message.id) {
                    if (embed.fields.length < 1) return message.channel.send(await client.lang(`embed.message4`));
                    interaction.reply(await client.lang(`embed.message3`));
                    message.channel.awaitMessages({ filter: m => m.author.id === message.author.id, max: 1, time: ms('2m'), errors: ["time"] }).then(async (co) => {
                        co.first().delete();
                        interaction.deleteReply();

                        if (isNaN(co.first().content)) return message.channel.send(await client.lang(`embed.message2`));
                        if (co.first().content > embed.fields.length) return message.channel.send(await client.lang(`embed.message2`));
                        var indexField = Number(co.first().content) - 1;
                        embed.spliceFields(indexField, 1);
                        msgembed.edit({ embeds: [embed] });
                    })
                }

                if (interaction.values[0] === "timestamp_" + message.id) {
                    interaction.reply(await client.lang(`embed.message1`))
                    message.channel.awaitMessages({ filter: m => m.author.id === message.author.id, max: 1, time: ms('2m'), errors: ["time"] }).then((collected) => {
                        interaction.deleteReply();
                        collected.first().delete();

                        if (collected.first().content === "oui" || "yes" && collected.first().content === "Oui" || "Yes") {
                            embed.setTimestamp()
                            msgembed.edit({ embeds: [embed] });
                        }
                        else if (collected.first().content === "non" || "no" && collected.first().content === "Non" || "no") {
                            return;
                        }
                    })
                }
            });


            const collector2 = message.channel.createMessageComponentCollector({ filter: m => m.user.id == message.author.id, componentType: Discord.ComponentType.Button, time: ms("2m") })
            collector2.on('collect', async (interaction) => {
                const value = interaction.customId;

                if (value === "buttonenable_" + message.id) {
                    const channel = new Discord.ChannelSelectMenuBuilder()
                        .setCustomId('embedchannel_' + message.id)
                        .setMaxValues(1)
                        .setMaxValues(1)
                        .setChannelTypes(0);
                    const row = new Discord.ActionRowBuilder()
                        .addComponents(channel);

                    interaction.update({ embeds: [], content: `${await client.lang(`embed.message16`)}`, components: [row] })
                }
                if (value === "buttondisable_" + message.id) {
                    msgembed.delete();

                }
                if (value === "buttoncopy_" + message.id) {
                    await message.channel.send(await client.lang(`embed.messages19`));

                    message.channel.awaitMessages({ filter: m => m.author.id === message.author.id, max: 1, time: ms('2m'), errors: ["time"] })
                        .then(async (collected) => {
                            const embedChannel = collected.first().content;
                            console.log(embedChannel);

                            const channel = message.guild.channels.cache.find(ch => ch.name === embedChannel || ch.id === embedChannel);
                            if (!channel) {
                                return message.channel.send(await client.lang(`embed.messages21`));
                            }

                            await message.channel.send(await client.lang(`embed.messages20`));

                            message.channel.awaitMessages({ filter: m => m.author.id === message.author.id, time: ms('2m'), errors: ["time"], max: 1 })
                                .then(async (collected2) => {
                                    const embedMessage = collected2.first().content;
                                    console.log(embedMessage);

                                    const parsedEmbed = JSON.parse(embedMessage);
                                    console.log(parsedEmbed)
                                    /*if (!parsedEmbed || !parsedEmbed.title) {
                                        return message.channel.send(await client.lang(`embed.invalidEmbed`));
                                    }*/

                                    console.log(parsedEmbed)

                                    collected2.first().delete();
                                    collected.first().delete();
                                })
                                .catch(async err => {
                                    message.channel.send(await client.lang(`embed.time`));
                                });
                        })
                        .catch(async err => {
                        });
                }

                        
                else if (value === "buttondisable_" + message.id) {
                    msgembed.delete();

                }
            })

            client.on('interactionCreate', async (i) => {
                if (message.author.id === i.user.id) {
                    if (i.customId === `embedchannel_${message.id}`) {
                        const channelid = i.values
                        const channel = await client.channels.fetch(channelid)
                        channel.send({ embeds: [embed] });
                        i.update({ content: `${await client.lang(`embed.message17`)} <#${channel.id}>`, embeds: [], components: [] })

                    }
                }
            }
            )
        }
        );
    }
}