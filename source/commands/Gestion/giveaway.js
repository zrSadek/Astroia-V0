const ms = require('ms');
const Discord = require('discord.js')
const { StringSelectMenuBuilder, ActionRowBuilder, EmbedBuilder, ChannelSelectMenuComponent } = require('discord.js');
const now = Date.now();

module.exports = {
    name: 'giveaway',
    aliases: ["gw"],
    description: 'Permet de configurer les giveway',
    run: async (client, message, args, commandName) => {
        let pass = false;
        let staff = client.staff;
        if (!staff.includes(message.author.id) && !client.config.buyers.includes(message.author.id) && client.db.get(`owner_${message.author.id}`) !== true) {
            if (client.db.get(`perm_${commandName}.${message.guild.id}`) === "1" && message.member.roles.cache.some(r => client.db.get(`perm1.${message.guild.id}`)?.includes(r.id))) pass = true;
            if (client.db.get(`perm_${commandName}.${message.guild.id}`) === "2" && message.member.roles.cache.some(r => client.db.get(`perm2.${message.guild.id}`)?.includes(r.id))) pass = true;
            if (client.db.get(`perm_${commandName}.${message.guild.id}`) === "3" && message.member.roles.cache.some(r => client.db.get(`perm3.${message.guild.id}`)?.includes(r.id))) pass = true;
            if (client.db.get(`perm_${commandName}.${message.guild.id}`) === "4" && message.member.roles.cache.some(r => client.db.get(`perm4.${message.guild.id}`)?.includes(r.id))) pass = true;
            if (client.db.get(`perm_${commandName}.${message.guild.id}`) === "5" && message.member.roles.cache.some(r => client.db.get(`perm5.${message.guild.id}`)?.includes(r.id))) pass = true;
            if (client.db.get(`perm_${commandName}.${message.guild.id}`) === "public") pass = true;
        } else {
            pass = true;
        }

       if (pass === false) {
    if (client.noperm && client.noperm.trim() !== '') {
        return message.channel.send(client.noperm);
    } else {
        return; 
    }
}
        const originalmsg = await message.channel.send('Chargement en cours...');
       
        async function updateEmbed() {
            const db = client.db.get(`setgiveaway_${message.guild.id}`) || client.db.set(`setgiveaway_${message.guild.id}`,
                {
                    prix: 'un prix',
                    gagnant: 1,
                    temps: null,
                    channel: message.channel.id,
                    vocal: false,
                    predef: null,
                    participant: [],
                    emoji: '🎉'
                })
            const prix = db.prix
            const gagnant = db.gagnant;
            const temps = db.temps ? formatTimeLeft(db.temps) : "Aucun temps défini";
            const channel = message.guild.channels.cache.get(db.channel) || "Aucun Salon";
            const vocal = db.vocal ? '`✅` Activer' : "`❌` non";
            const emoji = db.emoji;
            const predef = db.predef;
            const namedef = predef ? await Promise.all(predef.map(async userid => { const user = await client.users.fetch(userid); return user.username || "Inconnu"; })) : [];



            const embed = new EmbedBuilder()
                .setTitle(`Panel des Giveaways`)
                .setColor(client.color)
                .setFooter(client.footer)
                .addFields(
                    { name: '`🎁` Prix', value: `${prix}`, inline: true },
                    { name: '`👥` Gagnants', value: `${gagnant}`, inline: true },
                    { name: '`⏲️` Temps', value: `${temps}`, inline: true },
                    { name: '`📺` Salon', value: `${channel}`, inline: true },
                    { name: '`🔊` Vocal obligatoire', value: `${vocal}`, inline: true },
                    { name: '`🎉` Emoji', value: `${emoji}`, inline: true },
                    { name: '`🙋‍♂️` Gagnants prédéfinie', value: `\`\`\`yml\n${namedef.join(', ') || "Aucun Gagnants prédéfinie"}\`\`\``, inline: true }
                )

            const buttonreset = new Discord.ButtonBuilder()
                .setCustomId('gw_setup_reset_' + message.id)
                .setLabel('Reset')
                .setEmoji('⚠️')
                .setStyle(Discord.ButtonStyle.Danger)

            const buttonstart = new Discord.ButtonBuilder()
                .setCustomId('gw_setup_start_' + message.id)
                .setLabel('Lancé')
                .setEmoji('✅')
                .setStyle(Discord.ButtonStyle.Success)

            const select = new StringSelectMenuBuilder()
                .setCustomId(`gw_setup_` + message.id)
                .setMaxValues(1)
                .addOptions([
                    {
                        label: 'Prix',
                        value: 'prix_' + message.id,
                    },
                    {
                        label: 'Nombre de gagnants',
                        value: 'gagnant_' + message.id,
                    },
                    {
                        label: 'Temps',
                        value: 'temps_' + message.id,
                    },
                    {
                        label: 'Salon',
                        value: 'salon_' + message.id,
                    },
                    {
                        label: 'Vocal obligatoire',
                        value: 'vocal_' + message.id,
                    },
                    {
                        label: 'Emoji',
                        value: 'emoji_' + message.id,
                    },
                    {
                        label: 'Gagnants prédéfinie',
                        value: 'gagnantpredef_' + message.id,
                    },
                ])

            const roworig = new ActionRowBuilder()
                .addComponents(select);


            const rowbutton = new ActionRowBuilder()
                .addComponents(buttonstart, buttonreset);

            originalmsg.edit({ content: null, components: [roworig, rowbutton], embeds: [embed] });
        }
        await updateEmbed();

        const collector = message.channel.createMessageComponentCollector({ filter: m => m.user.id == message.author.id, componentType: Discord.ComponentType.StringSelect || Discord.ComponentType.Button, time: ms("2m") })

        collector.on("collect", async (i) => {
            const db = client.db.get(`setgiveaway_${message.guild.id}`)
            if (i.values[0] === `salon_${message.id}`) {
                const salonrow = new Discord.ActionRowBuilder().addComponents(
                    new Discord.ChannelSelectMenuBuilder()
                        .setCustomId('gw_setup_salon_' + message.id)
                        .setMaxValues(1)
                        .setChannelTypes(0)
                )
                i.reply({ embeds: [], content: 'Merci de choisir votre channel !', components: [salonrow] })

            } else if (i.values[0] === 'prix_' + message.id) {
                const filter = response => response.author.id === message.author.id;
                const sentMessage = await i.reply("Quel sera le prix du giveaway ? (Exemple : nitro boost)");

                try {
                    const collected = await message.channel.awaitMessages({ filter, max: 1, time: ms("1m"), errors: ['time'] });
                    const msg = collected.first().content.trim();
                    if (db.hasOwnProperty('prix')) {
                        db.prix = msg;
                        client.db.set(`setgiveaway_${message.guild.id}`, db);
                        await updateEmbed();


                        sentMessage.delete();
                        collected.first().delete();
                    } else {
                        message.reply('Une erreur vient de se produire')
                        sentMessage.delete();
                        collected.first().delete();
                    }
                } catch (error) {
                    sentMessage.delete();
                    message.channel.send("Temps de réponse expiré ou une erreur s'est produite.");
                }
            } else if (i.values[0] === 'gagnant_' + message.id) {
                const filter = response => response.author.id === message.author.id;
                const sentMessage = await i.reply("Combien de gagnants aura le giveaway ? (Maximum 25)");

                try {
                    const collected = await message.channel.awaitMessages({ filter, max: 1, time: ms("1m"), errors: ['time'] });
                    const winnersInput = collected.first().content.trim();

                    const winnersCount = parseInteger(winnersInput);

                    if (winnersCount === null || winnersCount < 1 || winnersCount > 25) {
                        message.channel.send("Nombre de gagnants invalide. Veuillez entrer un nombre entre 1 et 25.");
                    } else {
                        if (db.hasOwnProperty('gagnant')) {
                            db.gagnant = winnersCount;
                            client.db.set(`setgiveaway_${message.guild.id}`, db);
                            await updateEmbed();
                        }
                    }

                    sentMessage.delete();
                    collected.first().delete();
                } catch (error) {
                    sentMessage.delete();
                    message.channel.send("Temps de réponse expiré ou une erreur s'est produite.");
                }

            } else if (i.values[0] === 'temps_' + message.id) {
                const filter = response => response.author.id === message.author.id;
                const sentMessage = await i.reply("Quel sera le temps du giveaway ? (Exemple : 5d)");

                try {
                    const collected = await message.channel.awaitMessages({ filter, max: 1, time: ms("1m"), errors: ['time'] });
                    const timeInput = collected.first().content.trim();
                    const timestamp = parseTime(timeInput);
                    if (timestamp !== null) {
                        if (db.hasOwnProperty('temps')) {
                            db.temps = timestamp;
                            client.db.set(`setgiveaway_${message.guild.id}`, db);
                            await updateEmbed();
                        }

                        sentMessage.delete();
                        collected.first().delete();
                    } else {
                        message.channel.send("Temps invalide. Veuillez utiliser un format valide, par exemple : 5d");

                        sentMessage.delete();
                        collected.first().delete();
                    }
                } catch (error) {
                    sentMessage.delete();
                    message.channel.send("Temps de réponse expiré ou une erreur s'est produite.");
                }
            } else if (i.values[0] === 'emoji_' + message.id) {
                const filter = response => response.author.id === message.author.id;
                const sentMessage = await i.reply("Quel sera l'emoji du giveaway ?");

                const collected = await message.channel.awaitMessages({ filter, max: 1, time: ms("1m"), errors: ['time'] });
                const emojiInput = collected.first().content.trim();
                let emojiName;
                if (emojiInput.startsWith('<:') && emojiInput.endsWith('>')) {
                    emojiName = emojiInput.match(/:(.*):/)[1];
                } else {
                    emojiName = emojiInput;
                }
                if (db.hasOwnProperty('emoji')) {
                    db.emoji = emojiInput;
                    client.db.set(`setgiveaway_${message.guild.id}`, db);
                    await updateEmbed();
                }
                sentMessage.delete();
                collected.first().delete();
            }
            else if (i.values[0] === 'gagnantpredef_' + message.id) {
                const salonrow = new Discord.ActionRowBuilder().addComponents(
                    new Discord.UserSelectMenuBuilder()
                        .setCustomId('gw_setup_gagnant_' + message.id)
                        .setMaxValues(25)
                )
                i.reply({ embeds: [], content: 'Merci de choisir le/les gagnant(s) !', components: [salonrow] })
            } else if (i.values[0] === 'vocal_' + message.id) {
                const button = new Discord.ActionRowBuilder()
                    .addComponents(
                        new Discord.ButtonBuilder()
                            .setLabel('Activé')
                            .setCustomId('gw_setup_voc_activer_' + message.id)
                            .setStyle(Discord.ButtonStyle.Success),
                        new Discord.ButtonBuilder()
                            .setLabel('Désactivé')
                            .setCustomId('gw_setup_voc_off_' + message.id)
                            .setStyle(Discord.ButtonStyle.Danger),
                    )
                i.reply({ components: [button], content: 'Veillez selectionner si vous voulez activer ou désactiver !' })
            }
        })

        client.on('interactionCreate', async (i) => {
            if (message.author.id === i.user.id) {
                const db = client.db.get(`setgiveaway_${message.guild.id}`)
                if (i.customId === `gw_setup_salon_${message.id}`) {
                    const selecchannel = i.values[0];
                    if (db.hasOwnProperty('channel')) {
                        db.channel = selecchannel
                        client.db.set(`setgiveaway_${message.guild.id}`, db);
                    } else {
                        client.db.set(`setgiveaway_${message.guild.id}`, db);
                    }
                    await updateEmbed()
                    i.message.delete()
                } else if (i.customId === `gw_setup_voc_activer_${message.id}`) {
                    if (db.hasOwnProperty('vocal')) {
                        db.vocal = true
                        client.db.set(`setgiveaway_${message.guild.id}`, db);
                    } else {
                        client.db.set(`setgiveaway_${message.guild.id}`, db);
                    }
                    await updateEmbed()
                    i.message.delete()


                } else if (i.customId === `gw_setup_reset_${message.id}`) {
                    client.db.delete(`setgiveaway_${message.guild.id}`)
                    i.reply({ embeds: [], content: '`✅` les paramètres ont était bien reset', ephemeral: true })
                    await updateEmbed()


                } else if (i.customId === `gw_setup_voc_activer_${message.id}`) {
                    if (db.hasOwnProperty('vocal')) {
                        db.vocal = true
                        client.db.set(`setgiveaway_${message.guild.id}`, db);
                    } else {
                        client.db.set(`setgiveaway_${message.guild.id}`, db);
                    }

                } else if (i.customId === `gw_setup_start_${message.id}`) {
                    const db = client.db.get(`setgiveaway_${message.guild.id}`);

                    let missingOptions = [];

                    if (!db) {
                        missingOptions.push("le giveaway n'est pas configuré");
                    } else {
                        if (db.temps === null) {
                            missingOptions.push("le temps du giveaway");
                        }
                        if (db.channel === null) {
                            missingOptions.push("le salon du giveaway");
                        }
                        if (db.gagnants === null) {
                            missingOptions.push("le nombre de gagnants");
                        }
                        if (db.prix === 'un prix') {
                            missingOptions.push("le prix de gagnants");
                        }
                    }

                    if (missingOptions.length === 0) {
                        const code = generateRandomCode(6);
                        i.update({embeds: [], components: [], content: "Le giveaway a été lancé"});
                        const giveawayChannel = message.guild.channels.cache.get(db.channel);
                            const embed = new EmbedBuilder()
                                .setTitle('Giveaway')
                                .setDescription(`Prix : \`${db.prix}\`\nFini : <t:${Math.floor((Date.now() + db.temps) / 1000)}:R>\nLancée par : <@${i.user.id}>\nParticipant : 0`)
                                .setFooter(client.footer)
                                .setColor(client.color)
                                const row = new ActionRowBuilder()
                                .addComponents(
                                    new Discord.ButtonBuilder()
                                    .setEmoji(db.emoji)
                                    .setCustomId('giveaway_entry_' + code)
                                    .setStyle(Discord.ButtonStyle.Primary),
                                    new Discord.ButtonBuilder()
                                    .setLabel('Liste des participants')
                                    .setCustomId('giveaway_list_' + code)
                                    .setStyle(Discord.ButtonStyle.Secondary)
                                )
                                const giveawayMessage = await giveawayChannel.send({ embeds: [embed], components: [row] });
                                const newGiveawayData = {
                                    prix: db.prix,
                                    gagnant: db.gagnant,
                                    temps: db.temps + Date.now(),
                                    channel: db.channel,
                                    vocal: db.vocal,
                                    predef: db.predef,
                                    participant: [],
                                    emoji: db.emoji,
                                    host: i.user.id,
                                    createdTimestamp: Date.now(),
                                    messageid: giveawayMessage.id,
                                    ended: false
                                };
                    
                                client.db.set(`giveaway_${message.guild.id}_${code}`, newGiveawayData);
                                //client.db.delete(`setgiveaway_${message.guild.id}`)

                        
                    } else {
                        const missingOptionsString = missingOptions.map(option => `- \`${option}\``).join('\n');
                        i.reply({ embeds: [], components: [], content: `Le paramétrage du giveaway n'est pas fini. Voici ce qu'il reste à configurer :\n${missingOptionsString}`, ephemeral: true });
                    }

                } else if (i.customId === `gw_setup_voc_off_${message.id}`) {
                    if (db.hasOwnProperty('vocal')) {
                        db.vocal = false
                        client.db.set(`setgiveaway_${message.guild.id}`, db);
                    } else {
                        client.db.set(`setgiveaway_${message.guild.id}`, db);
                    }
                    await updateEmbed()
                    i.message.delete()
                } else if (i.customId === `gw_setup_gagnant_${message.id}`) {
                    const selectedUsers = i.values;
                    const giveawayData = client.db.get(`setgiveaway_${message.guild.id}`);
                    const existingUsers = giveawayData?.predef || [];

                    for (const userId of selectedUsers) {
                        if (existingUsers.includes(userId)) {
                            const updatedUsers = existingUsers.filter(id => id !== userId);
                            giveawayData.predef = updatedUsers;
                            client.db.set(`setgiveaway_${message.guild.id}`, giveawayData);
                        } else {
                            existingUsers.push(userId);
                            giveawayData.predef = existingUsers;
                            client.db.set(`setgiveaway_${message.guild.id}`, giveawayData);
                        }
                    }

                    await updateEmbed();
                    i.message.delete();
                }



            }

        })

        collector.on('end', () => {
            originalmsg.edit({ components: []});
        });
    }
}

function parseTime(timeString) {
    const regex = /(\d+)([smhdwy])/;
    const match = timeString.match(regex);
    if (!match) return null;
    const value = parseInt(match[1]);
    const unit = match[2];
    switch (unit) {
        case 's':
            return value * 1000
        case 'j':
            return value * 24 * 60 * 60 * 1000;
        case 'a':
            return value * 365 * 24 * 60 * 60 * 1000;
        case 'm':
            return value * 60 * 1000;
        case 'h':
            return value * 60 * 60 * 1000;
        case 'd':
            return value * 24 * 60 * 60 * 1000;
        case 'w':
            return value * 7 * 24 * 60 * 60 * 1000;
        case 'y':
            return value * 365 * 24 * 60 * 60 * 1000;
        default:
            return null;
    }
}

function formatTimeLeft(milliseconds) {
    if (milliseconds < 1000) {
        return `${milliseconds} millisecondes`;
    } else if (milliseconds < 60000) {
        return `${Math.floor(milliseconds / 1000)} secondes`;
    } else if (milliseconds < 3600000) {
        return `${Math.floor(milliseconds / 60000)} minutes`;
    } else if (milliseconds < 86400000) {
        return `${Math.floor(milliseconds / 3600000)} heures`;
    } else if (milliseconds < 31536000000) {
        return `${Math.floor(milliseconds / 86400000)} jours`;
    } else {
        return `${Math.floor(milliseconds / 31536000000)} années`;
    }
}

function parseInteger(input) {
    const parsed = parseInt(input);
    return isNaN(parsed) ? null : parsed;
}

function generateRandomCode(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters.charAt(randomIndex);
    }
    return code;
}