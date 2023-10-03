const ms = require('ms');
const Discord = require('discord.js')
const { StringSelectMenuBuilder, ActionRowBuilder, EmbedBuilder, ChannelSelectMenuComponent } = require('discord.js');

module.exports = {
    name: 'modmail',
    description: 'Permet de configurer les modmails',
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
            const dbmod = client.db.get(`modmail_${message.guild.id}`) || client.db.set(`modmail_${message.guild.id}`, { categorie: null, status: false, modérateur: null })
            const category = message.guild.channels.cache.get(dbmod.categorie) || "Aucune categorie";
            const status = dbmod?.status === true ? '🟢' : '🔴';
            const modRoles = dbmod?.modérateur;
            const modRoleNames = modRoles ? modRoles.map(roleId => message.guild.roles.cache.get(roleId)?.name || "Inconnu") : [];
            const embed = new EmbedBuilder()
                .setTitle(`Configuration Modmail`)
                .setColor(client.color)
                .setFooter(client.footer)
                .addFields(
                    { name: "Statut :", value: `\`\`\`yml\n${status}\`\`\`` },
                    { name: "Categorie :", value: ` \`\`\`yml\nNom : ${category.name || "Aucune categorie"} - Id : ${category.id || "Aucune categorie"}\`\`\`` },
                    { name: "Rôles Modérateurs :", value: `\`\`\`yml\n${modRoleNames.join(', ') || "Aucun rôle modérateur défini"}\`\`\`` }
                )

            const roworig = new ActionRowBuilder().addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId(`modmail_` + message.id)
                    .addOptions([
                        {
                            label: 'Status',
                            value: 'status_' + message.id,
                        },
                        {
                            label: 'Catégorie des ModMail',
                            value: 'categorie_' + message.id,
                        },
                        {
                            label: 'Rôle Modérateur',
                            value: 'mod_' + message.id,
                        },
                    ])
            );

            originalmsg.edit({ content: null, components: [roworig], embeds: [embed] });
        }
        await updateEmbed();

        const collector = message.channel.createMessageComponentCollector({ filter: m => m.user.id == message.author.id, componentType: Discord.ComponentType.StringSelect, time: ms("2m") })

        collector.on("collect", async (i) => {
            if (i.values[0] === `status_${message.id}`) {
                let db = client.db.get(`modmail_${message.guild.id}`);
                const currentStatus = db?.status;
                const newStatus = currentStatus === null ? true : !currentStatus;
                db = { ...db, status: newStatus };
                client.db.set(`modmail_${message.guild.id}`, db);
                const status = db?.status === true ? 'Le modmail a été activiter avec succès' : 'Le modmail a été déactiviter avec succès';

                i.reply({ content: status, ephemeral: true })
                await updateEmbed()
            }

            else if (i.values[0] === `categorie_${message.id}`) {
                const rowcategori = new Discord.ChannelSelectMenuBuilder()
                    .setCustomId('categorieselect_' + message.id)
                    .setMaxValues(1)
                    .setMaxValues(1)
                    .setChannelTypes(4);
                const row = new ActionRowBuilder()
                    .addComponents(rowcategori);
                i.update({ components: [row], embeds: [], content: "Merci de choisir la catégorie ou les modmail vont s'ourir" })

            } else if (i.values[0] === `mod_${message.id}`) {
                const rowmod = new Discord.RoleSelectMenuBuilder()
                    .setCustomId('rowmod_' + message.id)
                    .setMaxValues(1)
                    .setMaxValues(25)
                const row = new ActionRowBuilder()
                    .addComponents(rowmod);
                i.update({ components: [row], embeds: [], content: "Merci de choisir le ou les rôles modérateur" })

            }
        })

        client.on('interactionCreate', async (i) => {
            if (message.author.id === i.user.id) {
                if (i.customId === `rowmod_${message.id}`) {
                    const selectedRoles = i.values;
                    const modmailData = client.db.get(`modmail_${message.guild.id}`);
                    const existingRoles = modmailData?.modérateur || [];
            
                    for (const roleId of selectedRoles) {
                        const role = message.guild.roles.cache.get(roleId);
                        if (role && role.managed) {
                            i.reply({ content: `Le rôle "${role.name}" est un rôle de bot, merci de me donner un rôle valide !.`, ephemeral: true });
                            await updateEmbed();
                            return;
                        } else if (existingRoles.includes(roleId)) {
                            const updatedRoles = existingRoles.filter(id => id !== roleId);
                            modmailData.modérateur = updatedRoles;
                            client.db.set(`modmail_${message.guild.id}`, modmailData);
            
                            i.reply({ content: `Le rôle "${role.name}" a été retiré des rôles modérateurs.`, ephemeral: true });
                        } else {
                            existingRoles.push(roleId);
                            modmailData.modérateur = existingRoles;
                            client.db.set(`modmail_${message.guild.id}`, modmailData);
            
                            i.reply({ content: 'Les rôles sélectionnés sont désormais les rôles modérateurs !', ephemeral: true });
                        }
                    }
            
                    await updateEmbed();
                } else if (i.customId === `categorieselect_${message.id}`) {
                    const selectedOptions = i.values[0];
                    if (client.db.has(`modmail_${message.guild.id}`)) {
                        const modmailData = client.db.get(`modmail_${message.guild.id}`);
                        if (modmailData.hasOwnProperty('categorie')) {
                            modmailData.categorie = selectedOptions;
                            client.db.set(`modmail_${message.guild.id}`, modmailData);
                        }
                    } else {

                        client.db.set(`modmail_${message.guild.id}`, modmailData);
                    }

                    i.reply({ ephemeral: true, embeds: [], content: 'La catégorie a bien été configure !' })

                    await updateEmbed()
                }
            }
        })

        collector.on('end', () => {
            originalmsg.edit({ components: []});
        });    
    }
}
